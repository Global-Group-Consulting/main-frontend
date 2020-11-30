<template>
  <div>
    <portal to="dialog-pre-content" v-if="requestId">
      <v-alert type="info" class="mb-0" tile dense>
        <div
          v-html="
            $t(
              'dialogs.communicationDialog.alert-connected-request-new-deposit'
            )
          "
        ></div>

        <v-layout style="gap: 8px" class="my-2 mb-2">
          <v-btn
            link
            target="__blank"
            outlined
            x-small
            :href="'/requests?open=' + requestId"
          >
            <v-icon x-small class="mr-2">mdi-open-in-new</v-icon>
            {{ $t("dialogs.communicationDialog.btn-go-to-request") }}
          </v-btn>

          <v-btn
            color="red"
            v-if="canApproveRequest"
            x-small
            @click="requestReject"
            >{{ $t("dialogs.communicationDialog.btn-reject-request") }}</v-btn
          >
          <v-btn
            color="green"
            v-if="canApproveRequest"
            x-small
            @click="requestApprove"
            >{{ $t("dialogs.communicationDialog.btn-approve-request") }}</v-btn
          >
        </v-layout>
      </v-alert>
    </portal>

    <portal to="dialog-content" ref="test">
      <div v-if="dialogData.isConversation && dataFetching">
        <v-layout column>
          <v-row v-for="i of 4" :key="i" class="my-3">
            <v-col>
              <v-skeleton-loader
                type="paragraph"
                v-if="i % 2 != 0"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="1" align-self="center">
              <v-skeleton-loader type="avatar"></v-skeleton-loader>
            </v-col>
            <v-col>
              <v-skeleton-loader
                type="paragraph"
                v-if="i % 2 == 0"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-layout>
      </div>

      <div v-else class=" comunication-details">
        <!-- Conversation chat -->
        <v-timeline
          v-if="dialogData.isConversation"
          align-top
          ref="chatWrapper"
          :dense="$vuetify.breakpoint.smAndDown"
        >
          <v-timeline-item
            v-for="(item, i) of messagesList"
            :key="i"
            :color="getItemColor(item)"
            :left="setToLeft(item)"
            :right="setToRight(item)"
          >
            <span
              slot="opposite"
              v-html="
                $t('dialogs.communicationDialog.timeline-opposite', {
                  sender: getSender(item),
                  timestamp: $options.filters.dateFormatter(
                    item.created_at,
                    true
                  )
                })
              "
            >
            </span>

            <v-card
              :color="compactMode ? getItemColor(item) + ' lighten-5' : ''"
            >
              <div v-if="compactMode">
                <v-card-title class="text-subtitle-1 py-2">
                  <div>
                    {{ getSender(item) }}
                  </div>
                </v-card-title>
                <v-divider :color="getItemColor(item)"></v-divider>
              </div>

              <div
                class="v-alert__border v-alert__border--top red"
                v-if="calcMessageIsNew(item)"
              ></div>

              <v-card-text class="white text--primary pt-4">
                <p
                  class="text-right font-italic text-caption"
                  v-if="$vuetify.breakpoint.smAndDown"
                >
                  {{
                    $t("dialogs.communicationDialog.timeline-opposite-dense", {
                      timestamp: $options.filters.dateFormatter(
                        item.created_at,
                        true
                      )
                    })
                  }}
                </p>

                <div v-html="getMessageContent(item)" class="text-body-1"></div>

                <!-- message attachmetns -->
                <div v-if="item.files && item.files.length > 0">
                  <v-list dense light>
                    <v-divider></v-divider>
                    <v-list-item
                      v-for="file in item.files"
                      :key="file.id"
                      @click="previewFile(file)"
                      dense
                    >
                      <v-icon small class="mr-3">mdi-file</v-icon>

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ file.clientName }}
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-btn icon @click.prevent.stop="downloadFile(file)">
                        <v-icon>mdi-download</v-icon>
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>

        <!-- Simple message without any type of response -->
        <div v-else>
          <v-layout>
            <div v-if="showReceivers">
              <div>{{ $t("dialogs.communicationDialog.receivers") }}:</div>

              <span
                v-for="(receiver, i) of dialogData.receiver"
                :key="receiver.id"
              >
                {{ receiver.firstName }} {{ receiver.lastName }} ({{
                  $t(
                    "enums.UserRoles." +
                      $enums.UserRoles.getIdName(receiver.role)
                  )
                }})

                <span v-if="i < dialogData.receiver.length - 1">, </span><br />
              </span>
            </div>

            <v-spacer></v-spacer>

            <div>
              <div>
                {{
                  $t(
                    `enums.MessageTypes.${$enums.MessageTypes.getIdName(
                      dialogData.type
                    )}`
                  )
                }}
              </div>
              <small>
                {{ $options.filters.dateHourFormatter(dialogData.created_at) }}
              </small>
            </div>
          </v-layout>

          <v-divider></v-divider>

          <div class="my-6" v-html="dialogData.content"></div>

          <div v-if="dialogData.files && dialogData.files.length > 0">
            <v-list dense light>
              <v-divider></v-divider>
              <v-list-item
                v-for="file in dialogData.files"
                :key="file.id"
                @click="previewFile(file)"
                dense
              >
                <v-icon small class="mr-3">mdi-file</v-icon>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ file.clientName }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-btn icon @click.prevent.stop="downloadFile(file)">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </div>
    </portal>

    <portal to="dialog-actions" v-if="!dialogSettings.readonly">
      <v-layout column>
        <v-layout align-center v-if="!dataFetching">
          <text-editor
            :mentionsList="quotableUsers"
            class="flex-fill"
            v-model="newMessage"
          ></text-editor>

          <v-btn icon class="ml-2" :disabled="messageSending">
            <label for="comunication-attachment">
              <v-icon>mdi-paperclip</v-icon>
              <input
                type="file"
                class="d-none"
                id="comunication-attachment"
                multiple
                accept="image/*,.pdf"
                @change="newMessageAttachments = $event.currentTarget.files"
              />
            </label>
          </v-btn>

          <v-btn
            icon
            x-large
            class="ml-2"
            v-if="newMessage"
            @click="sendReply"
            :loading="messageSending"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-layout>

        <!-- New message attachments -->
        <v-layout
          class="mt-3"
          style="gap: 6px;"
          v-if="newMessageAttachments && newMessageAttachments.length > 0"
        >
          <v-tooltip top v-for="file of newMessageAttachments" :key="file.name">
            <template v-slot:activator="{ on }">
              <v-sheet
                width="60"
                height="60"
                elevation="1"
                rounded
                v-on="on"
                class="d-flex align-center justify-center"
                @click="previewFile(file)"
              >
                <v-img
                  v-if="file.type.includes('image')"
                  width="100%"
                  height="100%"
                  contain
                  :src="getFilePreview(file)"
                ></v-img>

                <v-icon large v-else>mdi-file</v-icon>
              </v-sheet>
            </template>

            <span>{{ file.name }}</span>
          </v-tooltip>
        </v-layout>
      </v-layout>
    </portal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex-composition-helpers";
import jsFileDownload from "js-file-download";

import TextEditor from "@/components/forms/inputs/TextEditor";

import requestsCrudActions from "../../functions/requestsCrudActions";

import {
  watch,
  computed,
  ref,
  onBeforeMount,
  onBeforeUnmount
} from "@vue/composition-api";

export default {
  name: "ComunicationDetailsDialog",
  components: {},
  setup(props, { root, refs, emit }) {
    const { $enums, $store, $alerts, $apiCalls, $auth, $vuetify } = root;

    let timerSetAsRead = null;
    let timerReloadData = null;

    let requestActions = ref({ reject: () => {}, approve: () => {} });

    const showQuoteMenu = ref(false);
    const showQuoteMenuX = ref(0);
    const showQuoteMenuY = ref(0);
    const messageSending = ref(false);
    const dataFetching = ref(true);

    const newMessage = ref("");
    const newMessageAttachments = ref([]);

    const messagesList = ref([]);
    const quotableUsersList = ref([]);

    const loggedUser = root.$auth.user;
    const publicRoles = [
      root.$enums.UserRoles["CLIENTE"],
      root.$enums.UserRoles["AGENTE"]
    ];
    const colors = {
      [root.$enums.UserRoles["CLIENTE"]]: "light-blue",
      [root.$enums.UserRoles["AGENTE"]]: "light-blue",
      [root.$enums.UserRoles["ADMIN"]]: "green",
      [root.$enums.UserRoles["SERV_CLIENTI"]]: "green"
    };

    const dialogSettings = computed(() => $store.getters["dialog/dialogData"]);
    const dialogData = computed(
      () => $store.getters["dialog/dialogData"].data || {}
    );
    const compactMode = computed(() => $vuetify.breakpoint.smAndDown);
    const filteredQuotableUsers = computed(() =>
      quotableUsersList.value.reduce((acc, curr) => {
        acc.push({
          ...curr,
          value: (curr.firstName + curr.lastName).replace(/ /g, ""),
          label: curr.firstName + " " + curr.lastName
        });

        return acc;
      }, [])
    );
    const showReceivers = computed(
      () => dialogData.value.senderId === $auth.user.id
    );
    const requestId = computed(() => {
      return dialogData.value.requestId || "";
    });
    let requestStatus = ref(dialogData.value?.request?.status || null);
    const canApproveRequest = computed(
      () =>
        requestId.value &&
        +$auth.user.role === $enums.UserRoles.ADMIN &&
        requestStatus.value === $enums.RequestStatus.LAVORAZIONE
    );

    function _getUserType(role) {
      if (publicRoles.includes(role || loggedUser.role)) {
        return "public";
      } else {
        return "admin";
      }
    }

    function _scrollToBottom() {
      setTimeout(() => {
        try {
          const wrapper = refs["chatWrapper"].$el;
          const container = wrapper.closest(".v-card__text");

          container.scrollTop = wrapper.scrollHeight;
        } catch (er) {
          console.info(er);
        }
      });
    }

    function _scheduleSetAsRead() {
      timerSetAsRead = setTimeout(async () => {
        let unreadMessages;

        if (dialogData.value.isConversation) {
          unreadMessages = messagesList.value.reduce((acc, _message) => {
            if (calcMessageIsNew(_message)) {
              acc.push(_message.id);
            }

            return acc;
          }, []);
        } else {
          unreadMessages = [dialogData.value.id];
        }

        if (unreadMessages.length > 0) {
          await $apiCalls.messagesSetAsRead({ ids: unreadMessages });
          emit("setAsRead", dialogData.value.id);
        }
      }, 5000);
    }

    function _extractMentions() {
      const fakeEl = document.createElement("div");

      fakeEl.innerHTML = newMessage.value;

      const mentionsElements = fakeEl.querySelectorAll(".mention");

      const toReturn = [];

      mentionsElements.forEach(_el => {
        toReturn.push(_el.dataset.mentionId);
      });

      return toReturn;
    }

    function _startDataReloadTimer() {
      clearTimeout(timerReloadData);

      timerReloadData = setTimeout(() => {
        _fetchMessages();
      }, 30000 /* 30 sec */);
    }

    async function _fetchMessages() {
      try {
        const result = await $apiCalls.conversationFetch(dialogData.value.id);

        root.$set(messagesList, "value", result.conversation.messages);

        if (result.quotableUsers) {
          root.$set(quotableUsersList, "value", result.quotableUsers);
        }

        _scrollToBottom();
        _scheduleSetAsRead();
        _startDataReloadTimer();
      } catch (er) {
        $alerts.error(er);
      }
    }

    async function _initRequestActions() {
      requestActions.value = requestsCrudActions(
        dialogData.value.request,
        root,
        emit
      );
    }

    function getSender(message) {
      return message.senderId === $auth.user.id
        ? root.$t("dialogs.communicationDialog.you")
        : message.sender.name;
    }

    function getItemColor(message) {
      return colors[message.sender.role];
    }

    function getMessageContent(message) {
      const content = message.content;

      return content.replace(/\n/g, "</br>");
    }

    function setToRight(message) {
      const userType = _getUserType();
      const messageType = _getUserType(message.sender.role);

      if (loggedUser.id === message.senderId || userType === messageType) {
        return true;
      }
    }

    function setToLeft(message) {
      return !setToRight(message);
    }

    function calcMessageIsNew(message) {
      return (
        !message.read_at &&
        message.senderId !== loggedUser.id &&
        message.receiverId === loggedUser.id
      );
    }

    function getFilePreview(file) {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }

      return new Promise(async (resolve, reject) => {
        const result = await $apiCalls.downloadFile(file.id);

        resolve(
          URL.createObjectURL(
            new Blob([result.data], {
              type: `${file.type}/${file.subtype}`
            })
          )
        );
      });
    }

    async function previewFile(file) {
      try {
        window.open(await getFilePreview(file), "__blank");
      } catch (er) {
        $alerts.error(er);
      }
    }

    async function downloadFile(file) {
      const result = await $apiCalls.downloadFile(file.id);

      jsFileDownload(result.data, file.clientName);
    }

    async function sendReply() {
      try {
        messageSending.value = true;

        const mentions = _extractMentions();
        const watchers = dialogData.value.watchersIds;

        if (mentions.length > 0) {
          mentions.forEach(_id => {
            if (!watchers.includes(_id)) {
              watchers.push(_id);
            }
          });
        }

        const result = await $apiCalls.communicationSend({
          content: newMessage.value,
          communicationAttachments: newMessageAttachments.value,
          subject: dialogData.value.subject,
          conversationId: dialogData.value.id,
          receiver: watchers,
          type: $enums.MessageTypes.CONVERSATION
        });

        root.$set(dialogData.value, "watchersIds", watchers);

        messagesList.value.push({
          ...result,
          sender: {
            role: loggedUser.role,
            name: root.$t("dialogs.communicationDialog.you")
          }
        });

        newMessage.value = "";
        newMessageAttachments.value = null;

        _scrollToBottom();
      } catch (er) {
        $alerts.error(er);
      } finally {
        messageSending.value = false;
      }
    }

    function onMessageInput(event) {
      const key = event.key;
    }

    async function requestApprove() {
      if (await requestActions.value.approve(dialogData.value.request)) {
        dialogData.value.request.status = $enums.RequestStatus.ACCETTATA;
        requestStatus.value = dialogData.value.request.status;

        emit("requestStatusChanged", {
          ...dialogData.value,
          request: dialogData.value.request
        });
      }
    }

    async function requestReject() {
      if (await requestActions.value.reject(dialogData.value.request)) {
        dialogData.value.request.status = $enums.RequestStatus.ACCETTATA;
        requestStatus.value = dialogData.value.request.status;

        emit("requestStatusChanged", {
          ...dialogData.value,
          request: dialogData.value.request
        });
      }
    }

    onBeforeMount(async () => {
      if (!dialogData.value.isConversation) {
        _scheduleSetAsRead();

        return;
      }

      if (dialogData.value.requestId) {
        _initRequestActions();
        requestStatus.value = dialogData.value.request.status;
      }

      await _fetchMessages();

      dataFetching.value = false;
    });

    onBeforeUnmount(() => {
      clearTimeout(timerSetAsRead);
      clearTimeout(timerReloadData);
    });

    return {
      dialogSettings,
      dialogData,
      messagesList,
      newMessageAttachments,
      newMessage,
      setToLeft,
      setToRight,
      getItemColor,
      getSender,
      getMessageContent,
      getFilePreview,
      calcMessageIsNew,
      compactMode,
      sendReply,
      previewFile,
      messageSending,
      downloadFile,
      showQuoteMenu,
      showQuoteMenuX,
      showQuoteMenuY,
      quotableUsers: filteredQuotableUsers,
      onMessageInput,
      dataFetching,
      showReceivers,
      requestId,
      canApproveRequest,
      requestApprove,
      requestReject
    };
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.comunication-details::v-deep {
  margin-bottom: -20px;

  .v-timeline-item__opposite {
    align-self: flex-start;
    margin-top: 7px;
  }
}

.demo {
  margin: 24px 0;
}

.input {
  width: 100%;
  border: #ccc 1px solid;
  border-radius: 6px;
  resize: vertical;
  min-height: 42px;
  padding: 12px;
  box-sizing: border-box;
  line-height: 1.2em;
  font-size: inherit;
}

.issue {
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
}

.mention-selected .issue {
  background: rgb(139, 212, 255);
}

.issue .number {
  font-family: monospace;
}

.dim {
  color: #666;
}

.preview {
  font-family: monospace;
  white-space: pre-wrap;
  margin-top: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 6px;
}
</style>
