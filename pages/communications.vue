<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-toolbar class="mb-5" v-if="permissions.seeToolbar.value">
        <v-toolbar-items class="flex-fill justify-center">
          <tooltip-btn
            :tooltip="$t('pages.communications.btn-new-conversation')"
            text
            icon-name="mdi-forum"
            @click="openNewCommunication($enums.MessageTypes.CONVERSATION)"
            v-if="permissions.createTicket.value"
          >
            {{ $t("pages.communications.btn-new-conversation") }}
          </tooltip-btn>

          <tooltip-btn
            :tooltip="$t('pages.communications.btn-new-message')"
            text
            icon-name="mdi-email-plus"
            @click="openNewCommunication($enums.MessageTypes.SERVICE)"
            v-if="permissions.createCommunication.value"
          >
            {{ $t("pages.communications.btn-new-message") }}
          </tooltip-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-tabs v-model="currentTab" centered>
        <v-tab v-for="tab of communicationsTabs" :key="tab.key">
          <v-badge :content="tab.unreadCounter"
                   :value="tab.unreadCounter"
                   color="orange"
          >
            {{ $t(`pages.communications.${tab.title}`) }}
          </v-badge>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentTab">
        <v-tab-item v-for="tab of communicationsTabs" :key="tab.key">
          <v-card>
            <data-table
              :items="communicationsList[tab.key]"
              :table-key="tab.key"
              schema="communicationsSchema"
              @click:row="openCommunication"
            >
              <template v-slot:item.subject="{ item }" v-if="currentTab === 1">
                <v-icon color="red" v-if="!item.read_at" x-small
                >mdi-asterisk
                </v-icon
                >
                {{ item.subject }}
              </template>

              <template v-slot:item.type="{ item }">
                {{
                  $t(
                    `enums.MessageTypes.${$enums.MessageTypes.getIdName(
                      item.type
                    )}`
                  )
                }}
              </template>

              <template v-slot:item.creator="{ item }">
                <div v-if="item.createdById !== $auth.user.id">
                  {{ item.creator.firstName }} {{ item.creator.lastName }}
                </div>

                <div v-else>{{ $t("pages.communications.me") }}</div>
              </template>

              <template v-slot:item.receiver="{ item }">
                <div v-for="(receiver, i) of item.receiver"
                     :key="receiver.id || i"
                     v-if="receiver">
                  <span v-if="i < receiversShowLimit">
                    {{ receiver.firstName }} {{ receiver.lastName }} ({{
                      $t(
                        "enums.UserRoles." +
                        $enums.UserRoles.getIdName(receiver.role)
                      )
                    }})<span v-if="i < item.receiver.length - 1">, </span>
                  </span>

                  <span v-else-if="i === receiversShowLimit">
                    + altri {{ item.receiver.length - receiversShowLimit }} utenti
                  </span>
                </div>
              </template>

              <template v-slot:item.unreadMessages="{ item }">
                <v-chip small v-if="item.unreadMessages" color="red" dark>
                  {{ item.unreadMessages }}
                </v-chip>

                <span v-else></span>
              </template>
            </data-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-flex>

    <comunication-details-dialog
      v-if="$store.getters['dialog/dialogId'] === 'CommunicationDetailsDialog'"
      @setAsRead="onSetAsRead"
      @requestStatusChanged="onRequestStatusChanged"
    ></comunication-details-dialog>

    <communication-new-dialog
      v-if="$store.getters['dialog/dialogId'] === 'CommunicationNewDialog'"
      @communicationAdded="onCommunicationAdded"
    ></communication-new-dialog>
  </v-layout>
</template>

<script>
import {reactive, onBeforeMount, ref, computed} from "@vue/composition-api";

import ComunicationDetailsDialog from "@/components/dialogs/ComunicationDetailsDialog";
import CommunicationNewDialog from "@/components/dialogs/CommunicationNewDialog";

import pageBasic from "@/functions/pageBasic";
import requestsCrudActions from "@/functions/requestsCrudActions.js";

import CommunicationsTabs from "@/config/tabs/communicationsTabs";
import DataTable from "@/components/table/DataTable";
import PageHeader from "@/components/blocks/PageHeader";

export default {
  name: "index",
  components: {PageHeader, DataTable, ComunicationDetailsDialog, CommunicationNewDialog},
  props: {
    receiversShowLimit: {
      type: Number,
      default: 2
    }
  },
  setup(props, {root}) {
    const {$apiCalls, $alerts, $enums, $auth, $route} = root;

    let dataRefreshTimer = null;
    const currentTab = ref(0);
    const communicationsList = reactive({
      messages: [],
      messagesSent: [],
      conversations: []
    });
    const rawList = [];
    const communicationsTabs = computed(() => {
        const tabs = CommunicationsTabs.filter(_tab => {
          return _tab.key === "messagesSent"
            ? $enums.UserRoles.ADMIN === $auth.user.role : true;
        })

        return tabs.map(tab => {
          const dataList = communicationsList[tab.key]
          let counter = 0

          if (tab.key === "conversations") {
            counter = dataList.reduce((acc, curr) => curr.unreadMessages > 0 ? acc + 1 : acc, 0)
          } else if (tab.key === "messages") {
            counter = dataList.reduce((acc, curr) => !curr.read_at ? acc + 1 : acc, 0)
          }

          tab.unreadCounter = counter

          return tab
        })
      }
    );
    const permissions = {
      createTicket: computed(
        () => true//$auth.user.role !== $enums.UserRoles.CLIENTE
      ),
      createCommunication: computed(() =>
        [$enums.UserRoles.ADMIN].includes(
          $auth.user.role
        )
      ),
      seeToolbar: computed(
        () =>
          permissions.createTicket.value ||
          permissions.createCommunication.value
      )
    };

    async function _fetchAll() {
      try {
        const result = await $apiCalls.communicationsFetch();

        rawList.push(...Object.values(result).flat());

        root.$set(communicationsList, "messages", result.messages.map(_msg => {
          // i create anyway the prop so i can observe it when changes.
          if (!_msg.read_at) {
            _msg.read_at = null
          }

          return _msg
        }));
        root.$set(communicationsList, "messagesSent", result.messagesSent);
        root.$set(communicationsList, "conversations", result.conversations);
      } catch (er) {
        $alerts.error(er);
      } finally {
        _startRefreshTimer();
      }
    }

    function _startRefreshTimer() {
      dataRefreshTimer = setTimeout(() => {
        _fetchAll();
      }, 120000 /* 2 minutes */);
    }

    function openCommunication(communication) {
      const isConversation =
        +communication.type === $enums.MessageTypes.CONVERSATION ||
        !communication.type;

      root.$store.dispatch("dialog/updateStatus", {
        id: "CommunicationDetailsDialog",
        title: communication.subject,
        fullscreen: isConversation,
        readonly: !isConversation || communication.readonly,
        texts: {cancelBtn: root.$t("dialogs.communicationDialog.btn-cancel")},
        data: {
          ...communication,
          isConversation
        }
      });
    }

    function openNewCommunication(type) {
      root.$store.dispatch("dialog/updateStatus", {
        id: "CommunicationNewDialog",
        title: root.$t(
          `dialogs.communicationNewDialog.title-${
            type === $enums.MessageTypes.CONVERSATION
              ? "conversation"
              : "service"
          }`
        ),
        fullscreen: false,
        readonly: false,
        data: {
          type
        }
      });
    }

    async function onCommunicationAdded(communication) {
      const updatedSection = await $apiCalls.communicationsFetch(
        communication.type +
        (communication.senderId === $auth.user.id ? "&out" : "")
      );

      if (communication.type === $enums.MessageTypes.CONVERSATION) {
        root.$set(communicationsList, "conversations", updatedSection);
      } else {
        root.$set(communicationsList, "messagesSent", updatedSection);
      }
    }

    /**
     * @param {string} unreadMessagesId
     */
    async function onSetAsRead(unreadMessagesId) {
      const unreadMessage = rawList.find(_comm => _comm.id === unreadMessagesId)
      const msgType = "unreadMessages" in unreadMessage ? "conversations" : "messages"

      communicationsList[msgType].forEach(_com => {
        if (_com.id === unreadMessagesId) {
          if (msgType === "conversations") {
            _com.unreadMessages = 0;
          } else {
            _com.read_at = new Date().toISOString();
          }
        }
      });
    }

    function onRequestStatusChanged(changedCommunication) {
      const communication = communicationsList.conversations.find(
        _com => (_com.id = changedCommunication.id)
      );

      communication.request.status = changedCommunication.request.status;
    }

    function onQueryChange(route) {
      const query = route.query;

      if (query.open) {
        const idToOpen = query.open;

        const communication = rawList.find(_req => _req.id === idToOpen);

        if (communication) {
          openCommunication(communication);
        }

        root.$router.replace({query: {}});
      }
    }


    onBeforeMount(async () => {
      await _fetchAll();

      onQueryChange($route)
    });

    return {
      ...pageBasic(root, "communications"),
      currentTab,
      communicationsList,
      communicationsTabs,
      openCommunication,
      openNewCommunication,
      onCommunicationAdded,
      onSetAsRead,
      permissions,
      onRequestStatusChanged,
      onQueryChange
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.onQueryChange(to)

    next()
  }
};
</script>

<style scoped></style>
