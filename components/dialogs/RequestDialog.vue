<template>
  <div>
    <portal to="dialog-pre-content">
      <v-alert
        v-if="showAlert"
        :type="
          formData.status === $enums.RequestStatus.LAVORAZIONE
            ? 'info'
            : 'warning'
        "
        :icon="alertIcon"
        class="mb-0"
        tile
        dense
      >
        <template v-if="formData.status === $enums.RequestStatus.RIFIUTATA">
          <div v-html="$t('dialogs.requests.alert-reject-reason')"></div>
          <strong>{{ formData.rejectReason }}</strong>
        </template>

        <template v-else-if="formData.status === $enums.RequestStatus.ANNULLATA">
          <div
            v-html="
              $t('dialogs.requests.alert-cancel-reason', {
                date: $options.filters.dateHourFormatter(formData.completed_at)
              })
            "
          ></div>
          <strong>{{ formData.cancelReason }}</strong>
        </template>

        <template v-else-if="formData.status === $enums.RequestStatus.LAVORAZIONE">
          <template v-if="!formData.autoWithdrawlAll">
            <template v-if="showConversatinLink">
              <p v-if="!ownByCurrentUser" class="mb-1"
                 v-html="$t('dialogs.requests.alert-in-progress', formData.conversation.creator)"/>

              {{ $t("dialogs.requests.alert-connected-communication") }}
              <v-btn
                link
                outlined
                x-small
                :href="'/communications#' + conversationId"
                target="__blank"
                v-if="ownByCurrentUser"
              >
                <v-icon x-small>mdi-open-in-new</v-icon>
                {{ $t("dialogs.requests.btn-go-to-conversation") }}
              </v-btn>
            </template>

            <template v-else-if="$store.getters['user/userIsAdmin']">
              {{ $t("dialogs.requests.alert-in-progress", formData.conversation.creator) }}
            </template>
          </template>

          <!-- Auto withdrawl request type -->
          <template v-else>
            {{ $t(`dialogs.requests.alert-auto-withdrawl${formData.autoWithdrawlAllRecursively ? "-recursive" : ''}`) }}
          </template>
        </template>
      </v-alert>

      <v-toolbar
        dense
        elevation="2"
        color="blue-grey lighten-5"
        v-if="canApprove || canCancelAutoWithdrawlAll"
      >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text color="red" v-if="canApprove" @click="onReject">
            <v-icon>mdi-close</v-icon>
            {{ $t("dialogs.requests.btn-reject") }}
          </v-btn>
          <v-btn text color="success" v-if="canApprove" @click="onApprove">
            <template
              v-if="[$enums.RequestTypes.VERSAMENTO, $enums.RequestTypes.RISC_CAPITALE].includes(formData.type) && formData.status === $enums.RequestStatus.NUOVA">
              <v-icon>mdi-wechat</v-icon>
              {{ $t("dialogs.requests.btn-chat") }}
            </template>

            <template v-else>
              <v-icon>mdi-check</v-icon>
              {{ $t("dialogs.requests.btn-accept") }}
            </template>
          </v-btn>

          <v-btn text color="red" v-if="canCancelAutoWithdrawlAll" @click="onCancelAutoWithdrawlAll">
            <v-icon>mdi-delete</v-icon>
            {{ $t("dialogs.requests.btn-cancel-auto-withdrawl") }}
          </v-btn>

        </v-toolbar-items>
        <v-spacer></v-spacer>
      </v-toolbar>
    </portal>

    <portal to="dialog-content">
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
        }}
      </v-btn>
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
import {mapGetters, mapState} from "vuex";
import {
  ref,
  onBeforeMount,
  reactive,
  watch,
  computed
} from "@vue/composition-api";
import {createNamespacedHelpers} from "vuex-composition-helpers";

import DynamicFieldset from "@/components/DynamicFieldset";
import requestSchema from "@/config/forms/requestSchema";

import requestsCrudActionsFn from "../../functions/requestsCrudActions";
import permissionsFn from "../../functions/permissions";
import {admin} from "../../config/roleBasedConfig";
import WalletTypes from "../../enums/WalletTypes";
import RequestStatus from "../../enums/RequestStatus";
import RequestTypes from "../../enums/RequestTypes";
import {moneyFormatter} from "~/plugins/filters";

export default {
  name: "RequestDialog",
  components: {DynamicFieldset},
  props: {
    value: false,
    requestData: {
      type: Object,
      default: () => ({})
    }
  },
  /**
   * @param {{}} props
   * @param {{root: {
   *    $enums: typeof import("../../plugins/enums").enums,
   *    $apiCalls: import("../../plugins/apiCalls").ApiCalls
   * }, emit: function}} param1
   */
  setup(props, {root, emit}) {
    const {$auth, $apiCalls, $store, $enums, $alerts} = root;
    const {useGetters: dialogUseGetters} = createNamespacedHelpers("dialog");
    const {useGetters: userUseGetters} = createNamespacedHelpers("user");
    const {dialogData} = dialogUseGetters(["dialogData"]);
    const {availableWallets} = userUseGetters(["availableWallets"]);
    const permissions = permissionsFn(root);

    const formData = ref({
      ...dialogData.value?.data,
      wallet: dialogData.value?.data.wallet || $enums.WalletTypes["DEPOSIT"],
      type: dialogData.value?.data.type || $enums.RequestTypes["VERSAMENTO"],
      availableAmount: dialogData.value?.data.availableAmount || 0,
      currency: dialogData.value?.data.currency || $enums.CurrencyType["EURO"],
      gold: dialogData.value?.data.gold || false,
      clubPack: dialogData.value?.data.clubPack || $enums.ClubPacks.UNSUBSCRIBED
    });

    const actions = requestsCrudActionsFn(formData, root, emit);

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
        case $enums.RequestTypes.RISC_INTERESSI_GOLD:
        case $enums.RequestTypes.VERSAMENTO:
          toReturn = wallet.value?.deposit ?? 0;
          break;
        case $enums.RequestTypes.RISC_INTERESSI:
        case $enums.RequestTypes.RISC_INTERESSI_BRITE:
          toReturn = wallet.value?.interestAmount ?? 0;
          break;
        case $enums.RequestTypes.RISC_PROVVIGIONI:
          toReturn = wallet.value?.currMonthCommissions ?? 0;
          break;
        case $enums.RequestTypes.COMMISSION_MANUAL_ADD:
          toReturn = formData.value.availableAmount
          break;
      }

      return toReturn;
    });

    const conversationId = computed(
      () => dialogData.value?.data.conversation?.id
    );

    const showAlert = computed(() => {
      const statuses = [
        $enums.RequestStatus.LAVORAZIONE,
        $enums.RequestStatus.RIFIUTATA,
        $enums.RequestStatus.ANNULLATA
      ];

      return statuses.includes(formData.value.status);
    });

    const showConversatinLink = computed(() => {
      return (
        formData.value.conversation &&
        (formData.value.conversation?.watchersIds?.includes($auth.user.id) || $auth.user.role === $enums.UserRoles.ADMIN)
      );
    });

    const ownByCurrentUser = computed(() => [formData.value?.conversation?.createdById, formData.value?.conversation?.directedToId].includes($auth.user.id))

    const canApprove = computed(() => {
      const isNewRequest = $enums.RequestStatus.NUOVA === +formData.value.status;
      const isInProgress = $enums.RequestStatus.LAVORAZIONE === +formData.value.status;
      // const ownByAdmin = isInProgress && ownByCurrentUser.value;

      return (isNewRequest || isInProgress) && permissions.userType === "admin" && !formData.value.autoWithdrawlAll;
    });

    const canCancelAutoWithdrawlAll = computed(() => {
      const isInProgress = $enums.RequestStatus.LAVORAZIONE === +formData.value.status;
      const isAuthUserRequest = $auth.user.id === formData.value.userId;
      const reqHasAutoWithdrawl = formData.value.autoWithdrawlAll

      return isInProgress && isAuthUserRequest && reqHasAutoWithdrawl;
    })

    const alertIcon = computed(() => {
      let icon = null

      if (formData.value.autoWithdrawlAll) {
        icon = "mdi-infinity"
      }

      if (formData.value.autoWithdrawlAllRecursively) {
        icon = "mdi-repeat"
      }

      return icon
    })

    async function onDelete() {
      const result = await actions.delete(this.formData);

      if (result) {
        this.close();

        emit("requestDeleted");
      }
    }

    async function onApprove() {
      const result = await actions.approve(formData.value);

      if (result) {
        this.close();

        emit("requestStatusChanged");
      }
    }

    async function onReject() {
      const result = await actions.reject(formData);

      if (result) {
        this.close();

        emit("requestStatusChanged");
      }
    }

    async function onCancelAutoWithdrawlAll() {
      const result = await actions.cancelAutoWithdrawlAll(formData);

      if (result) {
        const user = this.$auth.user;

        this.$auth.setUser({
          ...user,
          autoWithdrawlAll: null,
          autoWithdrawlAllRecursively: null
        })

        this.close();

        emit("requestStatusChanged");
      }
    }

    watch(
      availableAmount,
      value => {
        formData.value.availableAmount = availableAmount.value;
      },
      {immediate: true}
    );
    watch(
      () => formData.value.type,
      type => {
        formData.value.wallet =
          ![$enums.RequestTypes.RISC_PROVVIGIONI, $enums.RequestTypes.COMMISSION_MANUAL_ADD].includes(type)
            ? $enums.WalletTypes.DEPOSIT
            : $enums.WalletTypes.COMMISION;

        formData.value.currency = $enums.CurrencyType.EURO;
      },
      {immediate: true}
    );

    watch(() => formData.value.autoWithdrawlAll,
      value => {
        if (!value) {
          formData.value.autoWithdrawlAllRecursively = false
          formData.value.amount = 0;
        } else {
          formData.value.amount = "La somma disponibile l'ultimo del mese"
        }
      }
    )

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

      $store.dispatch("user/updateWallets", {apiCalls: $apiCalls, data});
    });

    return {
      formData,
      onDelete,
      onApprove,
      onReject,
      onCancelAutoWithdrawlAll,
      permissions,
      dialogData,
      availableWallets,
      conversationId,
      showAlert,
      showConversatinLink,
      canApprove,
      ownByCurrentUser,
      canCancelAutoWithdrawlAll,
      alertIcon
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
          requestAttachment: this.formData.requestAttachment,
          autoWithdrawlAll: this.formData.autoWithdrawlAll,
          autoWithdrawlAllRecursively: this.formData.autoWithdrawlAllRecursively
        };

        const reqTypeFormatted = this.$t(
          "enums.RequestTypes." +
          this.$enums.RequestTypes.get(data.type).id
        )

        await this.$alerts.askBeforeAction({
          key: "send-request",
          settings: {
            html: this.$t(`alerts.send-request${data.autoWithdrawlAll ? `-all${data.autoWithdrawlAllRecursively ? '-recursive' : ''}` : ""}-text`, {
              ...data,
              type: reqTypeFormatted,
              amount: "€ " + moneyFormatter(data.amount)
            })
          },
          preConfirm: async () => {
            const result = await this.$apiCalls.createRequest(data);

            if (data.autoWithdrawlAll) {
              const user = this.$auth.user;

              this.$auth.setUser({
                ...user,
                autoWithdrawlAll: result.id,
                autoWithdrawlAllRecursively: data.autoWithdrawlAllRecursively ? result.id : null
              })
            }
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
