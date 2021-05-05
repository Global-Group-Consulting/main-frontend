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
            <template v-if="showConversationLink">
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
      <v-skeleton-loader
        :loading="!dataLoaded"
        type="list-item-two-line@4"
      >
        <v-form :disabled="!!readonly" @submit.prevent="">
          <dynamic-fieldset
            ref="dialogForm"
            :schema="formSchema"
            v-model="formData"
            fill-row
          />
        </v-form>
      </v-skeleton-loader>
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

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import requestSchema from "~/config/forms/requestSchema";
import requestsCrudActionsFn from "~/functions/requestsCrudActions";

interface FormData {
  wallet: number
  type: number
  availableAmount: number
  currency: number
  gold: number
  clubPack: number
  status: number
  requestState: number
  id: string
  autoWithdrawlAll: string | null
  autoWithdrawlAllRecursively: string | null
  conversation: any
  amount: number | string
  rejectReason: string
  completed_at: string
  cancelReason: string
}

@Component({
  components: {DynamicFieldset},
})
export default class RequestDialog extends Vue {
  formData: FormData = {
    ...this.incomingData,
    wallet: this.incomingData.wallet || this.$enums.WalletTypes["DEPOSIT"],
    type: this.incomingData.type || this.$enums.RequestTypes["VERSAMENTO"],
    availableAmount: this.incomingData.availableAmount || 0,
    currency: this.incomingData.currency || this.$enums.CurrencyType["EURO"],
    gold: this.incomingData.gold || false,
    clubPack: this.incomingData.clubPack || this.$enums.ClubPacks.UNSUBSCRIBED
  }

  dataLoaded = false

  $refs!: {
    dialogForm: HTMLElement
  }

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get incomingData() {
    return this.dialogData.data
  }

  get formSchema() {
    return requestSchema(this as any)
  }

  get actions() {
    return requestsCrudActionsFn(this.formData, this as any, this.$emit);
  }

  get wallet() {
    return this.$store.getters["user/availableWallets"].find((_wallet: any) => _wallet.type === (this.formData.wallet || 1));
  };

  get availableAmount() {
    if (this.formData.status !== this.$enums.RequestStatus.NUOVA && this.formData.id) {
      return this.formData.availableAmount;
    }

    let toReturn = 0;

    switch (this.formData.type) {
      case this.$enums.RequestTypes.RISC_CAPITALE:
      case this.$enums.RequestTypes.RISC_INTERESSI_GOLD:
      case this.$enums.RequestTypes.VERSAMENTO:
        toReturn = this.wallet.deposit ?? 0;

        break;
      case this.$enums.RequestTypes.RISC_INTERESSI:
      case this.$enums.RequestTypes.RISC_INTERESSI_BRITE:
        toReturn = this.wallet.interestAmount ?? 0;

        break;
      case this.$enums.RequestTypes.RISC_PROVVIGIONI:
        toReturn = this.wallet.currMonthCommissions ?? 0;

        break;
      case this.$enums.RequestTypes.COMMISSION_MANUAL_ADD:
        toReturn = this.formData.availableAmount;

        break;
    }

    return toReturn;
  }

  get conversationId() {
    return this.incomingData.conversation?.id
  }

  get showAlert() {
    const statuses = [
      this.$enums.RequestStatus.LAVORAZIONE,
      this.$enums.RequestStatus.RIFIUTATA,
      this.$enums.RequestStatus.ANNULLATA
    ];

    return statuses.includes(this.formData.status);
  }

  get showConversationLink() {
    return (this.formData.conversation
      && (this.formData.conversation?.watchersIds?.includes(this.$auth.user.id)
        || this.$auth.user.role === this.$enums.UserRoles.ADMIN
      ));
  }

  get ownByCurrentUser() {
    return [this.formData.conversation?.createdById, this.formData.conversation?.directedToId]
      .includes(this.$auth.user.id)
  }

  get canApprove() {
    const isNewRequest = this.$enums.RequestStatus.NUOVA === +this.formData.status;
    const isInProgress = this.$enums.RequestStatus.LAVORAZIONE === +this.formData.status;
    // const ownByAdmin = isInProgress && ownByCurrentUser.value;

    return (isNewRequest || isInProgress)
      && this.$store.getters["user/userIsAdmin"]
      && !this.formData.autoWithdrawlAll
  }

  get canCancelAutoWithdrawlAll() {
    const isInProgress = this.$enums.RequestStatus.LAVORAZIONE === +this.formData.status;
    const isAuthUserRequest = this.$auth.user.id === this.formData.userId;
    const reqHasAutoWithdrawl = this.formData.autoWithdrawlAll

    return isInProgress && isAuthUserRequest && reqHasAutoWithdrawl;
  }

  get canDelete() {
    return (this.formData.id
      && this.formData.userId === this.$auth.user.id
      && this.formData.status === this.$enums.RequestStatus.NUOVA
    );
  }

  get canEdit() {
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

  get alertIcon() {
    let icon = null

    if (this.formData.autoWithdrawlAll) {
      icon = "mdi-infinity"
    }

    if (this.formData.autoWithdrawlAllRecursively) {
      icon = "mdi-repeat"
    }

    return icon
  }

  get readonly() {
    return this.formData.requestState
  }

  get isNew() {
    return !this.formData.id;
  }

  close() {
    this.$refs.dialogForm?.reset();
    this.$store.dispatch("dialog/updateStatus", false);
  }

  async onDelete() {
    const result = await this.actions.delete(this.formData);

    if (result) {
      this.close();

      this.emit("requestDeleted");
    }
  }

  async onApprove() {
    const result = await this.actions.approve(this.formData);

    if (result) {
      this.close();

      this.emit("requestStatusChanged");
    }
  }

  async onReject() {
    const result = await this.actions.reject(this.formData);

    if (result) {
      this.close();

      this.emit("requestStatusChanged");
    }
  }

  async onCancelAutoWithdrawlAll() {
    const result = await this.actions.cancelAutoWithdrawlAll();

    if (result) {
      const user = this.$auth.user;

      this.$auth.setUser({
        ...user,
        autoWithdrawlAll: null,
        autoWithdrawlAllRecursively: null
      })

      this.close();

      this.emit("requestStatusChanged");
    }
  }

  async onFormSubmit() {
    try {
      if (!(await this.$refs.dialogForm.validate(false))) {
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

      const reqTypeFormatted = this.$t("enums.RequestTypes." + this.$enums.RequestTypes.get(data.type).id)

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

  @Watch("availableAmount", {immediate: true})
  onAvailableAmountChange(value: number) {
    this.formData.availableAmount = value;
  }

  @Watch("formData.type", {immediate: true})
  onTypeChange(value: number) {
    this.formData.wallet =
      ![this.$enums.RequestTypes.RISC_PROVVIGIONI, this.$enums.RequestTypes.COMMISSION_MANUAL_ADD].includes(value)
        ? this.$enums.WalletTypes.DEPOSIT
        : this.$enums.WalletTypes.COMMISION;

    this.formData.currency = this.$enums.CurrencyType.EURO;
  }

  @Watch("formData.autoWithdrawlAll", {immediate: true})
  onAutoWithdrawlAllChange(value: number) {
    if (!value) {
      this.formData.autoWithdrawlAllRecursively = false
      this.formData.amount = 0;
    } else {
      this.formData.amount = "La somma disponibile l'ultimo del mese"
    }
  }

  async beforeMount() {
    /*
    If the request has a status different from new, don't try to fetch the user's wallet
    because it will use the availableAmount stored in the request
    */
    if (this.formData.status !== this.$enums.RequestStatus.NUOVA && this.formData.id) {
      setTimeout(() => this.dataLoaded = true, 500)

      return;
    }

    const data = {};

    if (this.$store.getters["user/userIsAdmin"]) {
      data.userId = this.formData.userId;
    }

    await this.$store.dispatch("user/updateWallets", {apiCalls: this.$apiCalls, data});

    this.dataLoaded = true
  }
}
</script>
