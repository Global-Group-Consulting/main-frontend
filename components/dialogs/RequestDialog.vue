<template>
  <div>
    <portal to="dialog-content">
      <v-alert
        type="warning"
        class="mt-3"
        v-if="formData.status === $enums.RequestStatus.RIFIUTATA"
      >
        <div v-html="$t('dialogs.requests.alert-reject-reason')"></div>
        <div>{{ formData.rejectReason }}</div>
      </v-alert>

      <v-toolbar
        dense
        elevation="2"
        color="blue-grey lighten-5"
        v-if="
          formData.status === $enums.RequestStatus.NUOVA &&
            permissions.userType === 'admin'
        "
      >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text color="red" @click="onReject">
            <v-icon>mdi-close</v-icon>
            {{ $t("dialogs.requests.btn-reject") }}
          </v-btn>
          <v-btn text color="success" @click="onApprove">
            <v-icon>mdi-check</v-icon>
            {{ $t("dialogs.requests.btn-accept") }}</v-btn
          >
        </v-toolbar-items>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form :disabled="!!readonly" @submit.prevent="">
        <dynamic-fieldset
          :ref="'request-form'"
          :schema="requestSchema"
          v-model="formData"
          fill-row
        />
      </v-form>
    </portal>

    <portal to="dialog-actions-left">
      <v-btn color="red" text v-if="canDelete" @click="onDelete">{{
        $t("dialogs.requests.btn-delete")
      }}</v-btn>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn text @click="close">
        {{ $t(`dialogs.requests.btn-${isNew ? "cancel" : "close"}`) }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="onFormSubmit" v-if="isNew">
        {{ $t("dialogs.requests.btn-send") }}
      </v-btn>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  ref,
  onBeforeMount,
  reactive,
  watch,
  computed
} from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import DynamicFieldset from "@/components/DynamicFieldset";
import requestSchema from "@/config/forms/requestSchema";

import WalletTypes from "../../enums/WalletTypes";

import requestsCrudActionsFn from "../../functions/requestsCrudActions";
import permissionsFn from "../../functions/permissions";
import { admin } from "../../config/roleBasedConfig";
import RequestStatus from "../../enums/RequestStatus";

export default {
  name: "RequestDialog",
  components: { DynamicFieldset },
  props: {
    value: false,
    requestData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    /**
     * @type {{$apiCalls: import("../../plugins/apiCalls").ApiCalls}}
     */
    const { $auth, $apiCalls, $store, $enums } = root;
    const { useGetters: dialogUseGetters } = createNamespacedHelpers("dialog");
    const { useGetters: userUseGetters } = createNamespacedHelpers("user");
    const { dialogData } = dialogUseGetters(["dialogData"]);
    const { availableWallets } = userUseGetters(["availableWallets"]);
    const permissions = permissionsFn(root);

    const formData = ref({
      ...dialogData.value?.data,
      wallet: dialogData.value?.data.wallet || $enums.WalletTypes["DEPOSIT"],
      type: dialogData.value?.data.type || $enums.RequestTypes["VERSAMENTO"],
      availableAmount: dialogData.value?.data.availableAmount || 0,
      currency: dialogData.value?.data.currency || $enums.CurrencyType["EURO"]
    });

    const actions = requestsCrudActionsFn(formData, root);

    const wallet = computed(() => {
      return availableWallets.value.find(
        _wallet => _wallet.type === (formData.value.wallet || 1)
      );
    });

    const availableAmount = computed(() => {
      const adminUser = [
        $enums.UserRoles.ADMIN,
        $enums.UserRoles.SERV_CLIENTI
      ].includes($auth.user.role);

      if (
        formData.value.status !== $enums.RequestStatus.NUOVA &&
        formData.value.id
      ) {
        return formData.value.availableAmount;
      }

      let toReturn = 0;

      switch (formData.value.type) {
        case $enums.RequestTypes.RISC_CAPITALE:
        case $enums.RequestTypes.VERSAMENTO:
          toReturn = wallet.value?.deposit ?? 0;
          break;
        case $enums.RequestTypes.RISC_INTERESSI:
        case $enums.RequestTypes.INTERESSI:
          toReturn = wallet.value?.interestAmount ?? 0;
          break;
      }

      return toReturn;
    });

    async function onDelete() {
      const result = await actions.delete(this.formData);

      if (result) {
        this.close();

        emit("requestDeleted");
      }
    }

    async function onApprove() {
      const result = await actions.approve(this.formData);

      if (result) {
        this.close();

        emit("requestStatusChanged");
      }
    }

    async function onReject() {
      const result = await actions.reject(this.formData);

      if (result) {
        this.close();

        emit("requestStatusChanged");
      }
    }

    watch(
      availableAmount,
      value => {
        formData.value.availableAmount = availableAmount.value;
      },
      { immediate: true }
    );
    watch(
      () => formData.value.type,
      type => {
        formData.value.wallet =
          type !== $enums.RequestTypes.INTERESSI
            ? $enums.WalletTypes.DEPOSIT
            : $enums.WalletTypes.COMMISION;

        formData.value.currency = $enums.CurrencyType.EURO;
      },
      { immediate: true }
    );

    onBeforeMount(async () => {
      /*
      If the request has a status different from new, don't try to fetch the user's wallet
      because it will use the availableAmount stored in the request
      */
      if (
        formData.value.status !== $enums.RequestStatus.NUOVA &&
        formData.value.id
      ) {
        return;
      }

      const data = {};

      if (permissions.userType === "admin") {
        data.userId = formData.value.userId;
      }

      $store.dispatch("user/updateWallets", { apiCalls: $apiCalls, data });
    });

    // I set the wallet here so that i can force the "availableAmount" computed refresh
    /* formData.value.wallet =
      dialogData.value?.data.wallet || $enums.WalletTypes["DEPOSIT"]; */

    return {
      formData,
      onDelete,
      onApprove,
      onReject,
      permissions,
      dialogData,
      availableWallets
    };
  },
  data() {
    return {
      opened: false
    };
  },
  computed: {
    requestSchema,
    requestTypes() {
      return this.$enums.RequestTypes.list.reduce((acc, item) => {
        acc.push({
          value: item.text,
          text: this.$t(`enums.RequestTypes.${item.text}`)
        });

        return acc;
      }, []);
    },

    isNew() {
      return !this.formData.id;
    },
    readonly() {
      return this.formData.requestState;
      // return this.$enums.RequestStatus.NUOVA !== this.requestData.requestState
    },
    canDelete() {
      return (
        this.formData.id &&
        this.formData.userId === this.$auth.user.id &&
        this.formData.status === this.$enums.RequestStatus.NUOVA
      );
    },
    canEdit() {
      const allowedRoles = [
        this.$enums.UserRoles.ADMIN,
        this.$enums.UserRoles.SERV_CLIENTI
      ];
      const allowedState = [this.$enums.RequestStatus.NUOVA];

      return (
        allowedRoles.includes(this.$auth.user.role) &&
        allowedState.includes(this.formData.requestState)
      );
    }
  },
  methods: {
    close() {
      this.$refs["request-form"]?.reset();
      this.$store.dispatch("dialog/updateStatus", false);
    },
    async onFormSubmit() {
      try {
        if (!(await this.$refs["request-form"].validate(false))) {
          return;
        }

        const data = {
          amount: this.formData.amount,
          userId: this.$auth.user.id,
          type: this.formData.type,
          wallet: this.formData.wallet,
          currency: this.formData.currency,
          notes: this.formData.notes,
          requestAttachment: this.formData.requestAttachment
        };

        await this.$alerts.askBeforeAction({
          key: "send-request",
          preConfirm: async () => {
            const result = await this.$apiCalls.createRequest(data);
          },
          data: {
            type: this.$t(
              "enums.RequestTypes." +
                this.$enums.RequestTypes.get(this.formData.type).id
            ),
            amount:
              this.$enums.CurrencyType.get(data.currency).symbol +
              " " +
              this.$options.filters.moneyFormatter(data.amount)
          }
        });

        this.$emit("newRequestAdded");

        this.close();
      } catch (er) {
        console.log(er);
      }
    }
  }
};
</script>
