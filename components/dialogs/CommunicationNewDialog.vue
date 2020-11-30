<template>
  <div>
    <portal to="dialog-content">
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

import { ref, onBeforeMount, computed, onMounted } from "@vue/composition-api";

export default {
  name: "CommunicationNewDialog",
  components: { DynamicFieldset },

  setup(props, { root, refs, emit }) {
    const { $apiCalls, $alerts, $enums, $store } = root;

    const formData = ref({});
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
      if (formData.value.receiver) {
        return usersList.value.filter(
          _cc =>
            !formData.value.receiver.find(
              _receiver => _receiver === _cc.value
            ) || !_cc.value
        );
      }

      return usersList.value;
    });

    const communicationNewSchema = computed(CommunicationNewSchema);

    function _formatUsersList(list) {
      let lastType = "";

      return list.reduce((acc, _user) => {
        const role = root.$t(
          `enums.UserRoles.${$enums.UserRoles.getIdName(_user.role)}`
        );

        if (lastType !== role) {
          lastType = role;

          acc.push(...[{ divider: true }, { header: role }]);
        }

        acc.push({
          value: _user.id,
          text: _user.firstName + " " + _user.lastName,
          role
        });

        return acc;
      }, []);
    }

    async function closeDialog() {
      $store.dispatch("dialog/updateStatus", false);
    }

    async function onSubmit() {
      const form = refs["form"];

      if (!(await form.validate())) {
        return;
      }

      try {
        messageSending.value = true;

        const receiver = [
          ...(formData.value.receiver || []),
          ...(formData.value.watchers || [])
        ];

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

        emit("communicationAdded", result);

        $alerts.toastSuccess("communication-new-success");
        closeDialog();
      } catch (er) {
        $alerts.error(er);
      } finally {
        messageSending.value = false;
      }
    }

    function _fillFormData() {
      root.$set(formData, "value", {
        subject: dialogData.value.subject,
        receiver: [dialogData.value.request.user.id],
        message: dialogData.value.message
      });
    }

    onMounted(() => {
      if (
        dialogData.value.request &&
        dialogData.value.request.type === $enums.RequestTypes.VERSAMENTO
      ) {
      }
    });

    onBeforeMount(async () => {
      try {
        const result = await $apiCalls.communicationsFetchReceivers();

        root.$set(usersList, "value", _formatUsersList(result));

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
  }
};
</script>

<style scoped></style>
