<template>
  <v-layout>
    <v-flex>
      <page-header page-name="communications"></page-header>

      <page-toolbar v-if="permissions.seeToolbar">
        <template slot="center-block">
          <tooltip-btn
            :tooltip="$t('pages.communications.btn-new-conversation')"
            text
            icon-name="mdi-forum"
            @click="openNewCommunication($enums.MessageTypes.CONVERSATION)"
            v-if="permissions.createTicket"
          >
            {{ $t("pages.communications.btn-new-conversation") }}
          </tooltip-btn>

          <tooltip-btn
            :tooltip="$t('pages.communications.btn-new-message')"
            text
            icon-name="mdi-email-plus"
            @click="openNewCommunication($enums.MessageTypes.SERVICE)"
            v-if="permissions.createCommunication"
          >
            {{ $t("pages.communications.btn-new-message") }}
          </tooltip-btn>
        </template>
      </page-toolbar>

      <v-tabs v-model="currentTab">
        <v-tab v-for="tab of communicationsTabs" :key="tab.key">
          <v-badge :content="tab.unreadCounter"
                   :value="tab.unreadCounter"
                   color="orange"
          >
            {{ $t(`pages.communications.${tab.title}`) }}
          </v-badge>
        </v-tab>
      </v-tabs>

      <v-card class="overflow-hidden">
        <v-tabs-items v-model="currentTab" touchless>
          <v-tab-item v-for="tab of communicationsTabs" :key="tab.key" :eager="tab.key === 'news'">
            <template v-if="tab.key === 'news'">
              <NewsTab @input="newsUnreadCounter = $event"/>
            </template>
            <template v-else>
              <data-table
                :items="communicationsList[tab.key]"
                :table-key="tab.key"
                :items-per-page="25"
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
                  <div v-if="item.createdById !== $auth.user.id && item.creator">
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

                <template v-slot:item.reqStatus="{item}">
                <span v-if="item.request">
                {{ $t("enums.RequestStatus." + $enums.RequestStatus.getIdName(item.request.status)) }}
                </span>
                </template>
              </data-table>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
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

<script lang="ts">
  import CommunicationNewDialog from "@/components/dialogs/CommunicationNewDialog.vue";

  import CommunicationsTabs from "@/config/tabs/communicationsTabs";
  import PageHeader from "@/components/blocks/PageHeader.vue";
  import { ClubPermissions } from "~/functions/acl/enums/club.permissions";
  import { Component, Vue, Watch } from "vue-property-decorator";
  import NewsTab from "@/components/tabs/NewsTab.vue";
  import { computed } from '@vue/composition-api';

  @Component({
    components: { PageHeader, NewsTab },
    meta: {
      // permissions: [CommunicationsPermissions.ACL_COMMUNICATIONS_ALL_READ, CommunicationsPermissions.ACL_COMMUNICATIONS_SELF_READ]
    },
  })
  export default class Communications extends Vue {
    public receiversShowLimit: number = 2
    public dataRefreshTimer: any = null;
    public currentTab: number = 0
    public communicationsList: any = {
      messages: [],
      messagesSent: [],
      conversations: [],
      clubConversations: []
    }
    public rawList: any[] = [];
    public newsUnreadCounter: number = 0;

    get permissions () {
      const createTicket = true; //$auth.user.role !== $enums.UserRoles.CLIENTE
      const createCommunication = [this.$enums.UserRoles.ADMIN].includes(this.$auth.user.role)

      return {
        createTicket,
        createCommunication,
        seeToolbar: createTicket || createCommunication
      }
    };

    get communicationsTabs () {
      const tabs: any = CommunicationsTabs.filter((_tab: any) => {
        if (_tab.key === "messagesSent") {
          return this.$enums.UserRoles.ADMIN === this.$auth.user.role
        } else if (_tab.key === "clubConversations") {
          return this.$acl.checkPermissions([ClubPermissions.BRITES_SELF_USE, ClubPermissions.CLUB_APPROVE])
        }

        return true
      })

      return tabs.map((tab: any) => {
        const dataList: any = this.communicationsList[tab.key]
        let counter = 0

        if (["conversations", "clubConversations"].includes(tab.key)) {
          counter = dataList.reduce((acc: any, curr: any) => curr.unreadMessages > 0 ? acc + 1 : acc, 0)
        } else if (tab.key === "messages") {
          counter = dataList.reduce((acc: any, curr: any) => !curr.read_at ? acc + 1 : acc, 0)
        }

        if (tab.key === "news") {
          tab.unreadCounter = this.newsUnreadCounter
        } else {
          tab.unreadCounter = counter
        }

        return tab
      })
  }

  get dialogState() {
    return this.$store.getters["dialog/dialogState"]
  }

  private async _fetchAll() {
    try {
      const result: any = await this.$apiCalls.communicationsFetch();

      this.rawList.push(...Object.values(result).flat());

      this.communicationsList.messages = result.messages.map((_msg: any) => {
        // i create anyway the prop so i can observe it when changes.
        if (!_msg.read_at) {
          _msg.read_at = null
        }

        return _msg
      })
      this.communicationsList.messagesSent = result.messagesSent
      this.communicationsList.conversations = result.conversations
      this.communicationsList.clubConversations = result.clubConversations
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      this._startRefreshTimer();
    }
  }

  private _startRefreshTimer() {
    this.dataRefreshTimer = setTimeout(() => {
      this._fetchAll();
    }, 120000 /* 2 minutes */);
  }

  openCommunication(communication: any) {
    const isConversation =
      +communication.type === this.$enums.MessageTypes.CONVERSATION ||
      !communication.type;

    this.$store.dispatch("dialog/updateStatus", {
      id: "CommunicationDetailsDialog",
      title: communication.subject,
      large: true,
      showCloseBtn: true,
      theme: "communications",
      // fullscreen: isConversation,
      readonly: !isConversation || communication.readonly,
      texts: {cancelBtn: this.$t("dialogs.communicationDialog.btn-cancel")},
      data: {
        ...communication,
        isConversation
      }
    });
  }

  openNewCommunication(type: number, to?: string, subject?: string) {
    this.$store.dispatch("dialog/updateStatus", {
      id: "CommunicationNewDialog",
      title: this.$t(
        `dialogs.communicationNewDialog.title-${
          type === this.$enums.MessageTypes.CONVERSATION
            ? "conversation"
            : "service"
        }`
      ),
      fullscreen: false,
      readonly: false,
      data: {
        type,
        subject,
        receiver: to
      }
    });
  }

  async onCommunicationAdded(communication: any) {
    const updatedSection = await this.$apiCalls.communicationsFetch(
      communication.type +
      (communication.senderId === this.$auth.user.id ? "&out" : "")
    );

    if (communication.type === this.$enums.MessageTypes.CONVERSATION) {
      this.communicationsList.conversations = updatedSection
    } else {
      this.communicationsList.messagesSent = updatedSection
    }
  }

  /**
   * @param {string} unreadMessagesId
   */
  async onSetAsRead(unreadMessagesId: string) {
    const unreadMessage: any = this.rawList.find((_comm: any) => _comm.id === unreadMessagesId)
    const msgType = "unreadMessages" in unreadMessage ? "conversations" : "messages"

    this.communicationsList[msgType].forEach((_com: any) => {
      if (_com.id === unreadMessagesId) {
        if (msgType === "conversations") {
          _com.unreadMessages = 0;
        } else {
          _com.read_at = new Date().toISOString();
        }
      }
    });
  }

  onRequestStatusChanged(changedCommunication: any) {
    const communication: any = this.communicationsList.conversations.find(
      (_com: any) => (_com.id = changedCommunication.id)
    );

    communication.request.status = changedCommunication.request.status;
  }

  checkQueryParams() {
    const params: Record<string, any> = this.$route.query;

    if (params.to) {
      this.openNewCommunication(this.$enums.MessageTypes.CONVERSATION, params.to, params.subject)
    }
  }

  @Watch("$route.hash")
  onUrlHashChange() {
    const hash = window.location.hash.replace("#", "")

    if (!hash) {
      return
    }

    const communication = this.rawList.find((_req: any) => _req.id === hash);

    if (communication) {
      this.openCommunication(communication);
    }
  }

  @Watch('dialogState')
  onDialogClose(value: boolean) {
    if (!value) {
      window.location.hash = ""
      this.$router.replace({query: {}})
    }
  }

  async beforeMount() {
    await this._fetchAll();

    this.onUrlHashChange()
    this.checkQueryParams()
  }
};
</script>

