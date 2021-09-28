<template>
  <div ref="test">
    <portal to="dialog-content" ref="dialogContent">
      <dynamic-fieldset
        :schema="communicationNewSchema"
        v-model="formData"
        fill-row
        ref="form"
      ></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="close" :disabled="gLoading">
        {{ $t("dialogs.communicationNewDialog.btn-cancel") }}
      </v-btn>
      <v-btn color="success" @click="onSubmit" :loading="gLoading">
        {{ $t("dialogs.communicationNewDialog.btn-send") }}
        <v-icon class="ml-2">mdi-send</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script>
import CommunicationNewSchema from "@/config/forms/communicationNewSchema";

import DynamicFieldset from "@/components/DynamicFieldset";

import {ref, onBeforeMount, computed, onMounted, nextTick,} from "@vue/composition-api";
import UserRoles from "@/enums/UserRoles";

export default {
  name: "CommunicationNewDialog",
  components: {DynamicFieldset},

  setup(props, {root, refs, emit, app}) {
    const {$apiCalls, $alerts, $enums, $store, $auth} = root;

    const test = ref(null);
    const form = ref(null);
    const formData = ref({
      receiver: []
    });
    const usersList = ref([]);
    const messageSending = ref(false);

    const dialogSettings = computed(() => $store.getters["dialog/dialogData"]);
    const dialogData = computed(
      () => $store.getters["dialog/dialogData"].data || {}
    );

    const availableReceivers = computed(() => {
      if (formData.value.watchers) {
        return usersList.value.filter(
          _receiver =>
            !formData.value.watchers.find(_cc => _cc === _receiver.value) ||
            !_receiver.value
        );
      }

      return usersList.value;
    });
    const availableCC = computed(() => {
      if (formData.value.receiver && formData.value.receiver instanceof Array) {
        return usersList.value.filter(
          _cc =>
            !formData.value.receiver.find(
              _receiver => _receiver === _cc.value
            ) || !_cc.value
        );
      }

      return usersList.value;
    });
    const userType = computed(() => [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes($auth.user.role) ? "admin" : "user")

    const communicationNewSchema = computed(CommunicationNewSchema);


    async function closeDialog() {
      $store.dispatch("dialog/updateStatus", false);
    }

    async function onSubmit() {
      const form = refs.dialogContent.$slots.default[0].componentInstance

      if (!(await form.validate())) {
        return;
      }

      try {
        messageSending.value = true;

        const receiver = [
          (formData.value.receiver || []),
          (formData.value.watchers || [])
        ].flat();

        const communicationData = {
          content: formData.value.message,
          communicationAttachments: formData.value.attachments,
          subject: formData.value.subject,
          receiver,
          type: dialogData.value.type
        };

        if (dialogData.value.request) {
          communicationData.requestId = dialogData.value.request.id;
        }

        const result = await $apiCalls.communicationSend(communicationData);

        if (!result) {
          throw new Error("No communication was created")
        }

        emit("communicationAdded", result);

        $alerts.toastSuccess(communicationData.type !== $enums.MessageTypes.BUG_REPORT ?
          "communication-new-success" : "bug-report-success");

        await closeDialog();
      } catch (er) {
        $alerts.error(er);
      } finally {
        messageSending.value = false;
      }
    }

    function _formatUsersList(list) {
      let lastType = "";

      return list.reduce((acc, _user) => {
        let receiverRole = _user.role
        let role = root.$t(
          `enums.UserRoles.${$enums.UserRoles.getIdName(
            receiverRole instanceof Array ?
              UserRoles.SERV_CLIENTI : _user.role
          )}`
        );

        const toAdd = {
          value: _user.id,
          text: _user.firstName + " " + _user.lastName,
          role
        }

        if (!_user.id) {
          Object.assign(toAdd, {
            value: _user.role,
            text: role,
            role
          })

          if (dialogData.value.type !== $enums.MessageTypes.CONVERSATION) {
            toAdd.text = root.$t(
              `enums.UserRoles.${$enums.UserRoles.getIdName(_user.role)}_plural`
            );

          }
        } else {
          if ($enums.UserRoles.CLIENTE === $auth.user.role) {
            toAdd.text += ` (${root.$t("dialogs.communicationNewDialog.your-agent")})`
          } else {
            toAdd.text += ` (${role})`
          }
        }

        if (![$enums.UserRoles.CLIENTE, $enums.UserRoles.AGENTE].includes($auth.user.role)
          && dialogData.value.type === $enums.MessageTypes.CONVERSATION) {
          if (lastType !== role && $auth.user.role !== $enums.UserRoles.CLIENTE) {
            lastType = role;

            acc.push(...[{divider: true}, {header: role}]);
          }
        }

        acc.push(toAdd);

        return acc;
      }, []);
    }

    function _fillFormData() {
      root.$set(formData, "value", {
        subject: dialogData.value.subject,
        receiver: [dialogData.value.request.user.id],
        message: dialogData.value.message
      });
    }

    function _setReceiverFromDialogData() {
      if (dialogData.value.receiver) {
        root.$set(formData, "value", {
          receiver: [dialogData.value.receiver]
        })
      }
    }

    /*onMounted(() => {
      if (
        dialogData.value.request &&
        dialogData.value.request.type === $enums.RequestTypes.VERSAMENTO
      ) {
      }
    });*/

    onBeforeMount(async () => {
      try {
        if (dialogData.value.type !== $enums.MessageTypes.BUG_REPORT) {
          const result = await $apiCalls.communicationsFetchReceivers(dialogData.value.type);

          root.$set(usersList, "value", _formatUsersList(result));
        }

        _setReceiverFromDialogData()

        if (userType.value === "user") {
          formData.value.receiver = $enums.UserRoles.SERV_CLIENTI
        }

        if (dialogData.value.type === $enums.MessageTypes.BUG_REPORT) {
          root.$set(formData, "value", {
            type: dialogData.value.type,
            subject: dialogData.value.subject,
            receiver: [dialogData.value.receiver],
          });
        }

        if (dialogData.value.request) {
          _fillFormData();
        }
      } catch (er) {
        $alerts.error(er);
      }
    });

    return {
      formData,
      availableReceivers,
      availableCC,
      communicationNewSchema,
      dialogSettings,
      dialogData,
      onSubmit,
      messageSending,
      close: closeDialog
    };
  },
  computed: {
    formRef() {
      return this.$refs.form
    }
  },
};
</script>

<style scoped></style>
