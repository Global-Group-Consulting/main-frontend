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

            <p v-else-if="$store.getters['user/userIsAdmin']" class="mb-0"
               v-html="$t('dialogs.requests.alert-in-progress', formData.conversation.creator)">
            </p>
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

          <v-btn text v-if="showNewAgentCommunication"
                 :href="`/communications?to=${userRefAgent}&subject=Comunicazione generica`"
                 target="_blank">
            <v-icon>mdi-chat-plus-outline</v-icon>
            Scrivi all'Agente
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
            immediate-update
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
      <v-btn color="blue darken-1" text @click="onFormSubmit" v-if="isNew && dataLoaded">
        {{ $t("dialogs.requests.btn-send") }}
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import requestSchema from "~/config/forms/requestSchema";
import {moneyFormatter} from "~/plugins/filters";
import {DynamicForm} from "~/@types/DynamicForm";
import {RequestsTableActions} from "~/functions/requestsTableActions";
import RequestTypes from "~/enums/RequestTypes";
import RequestStatus from "~/enums/RequestStatus";

interface FormData {
  wallet: number
  type: number
  availableAmount: number
  goldAmount: number
  currency: number
  gold: boolean
  clubPack: string
  status: number
  requestState: number
  id: string
  autoWithdrawlAllRecursively: any
  autoWithdrawlAll: any
  conversation: any
  requestAttachment: any
  amount: number | string
  rejectReason: string
  completed_at: string
  cancelReason: string
  notes: string
  userId: string
}

@Component({
  components: {DynamicFieldset: DynamicFieldset as any},
})
export default class RequestDialog extends Vue {
  private reqData!: Record<string, any>;

  formData: Partial<FormData> = {
    amount: 0,
    goldAmount: undefined,
    availableAmount: 0,
    wallet: this.$enums.WalletTypes["DEPOSIT"],
    type: this.$enums.RequestTypes["VERSAMENTO"],
    currency: this.$enums.CurrencyType.EURO,
    gold: false,
    clubPack: this.$enums.ClubPacks.UNSUBSCRIBED,
    autoWithdrawlAll: null,
    autoWithdrawlAllRecursively: false
  }

  dataLoaded = false

  $refs!: {
    dialogForm: HTMLElement & DynamicForm
  }

  actions!: RequestsTableActions;

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get incomingData() {
    return this.dialogData.data
  }

  get formSchema() {
    if (this.dataLoaded) {
      return requestSchema(this as any)
    }
  }

  /* get actions() {
     if (this.dataLoaded) {
       return requestsCrudActionsFn(this.formData, this as any, this.$emit);
     }
   }*/

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
      case this.$enums.RequestTypes.VERSAMENTO:
        toReturn = this.wallet.deposit ?? 0;

        break;
      case this.$enums.RequestTypes.RISC_INTERESSI:
      case this.$enums.RequestTypes.RISC_INTERESSI_BRITE:
      case this.$enums.RequestTypes.RISC_INTERESSI_GOLD:
        toReturn = this.wallet.interestAmount ?? 0;

        break;
      case this.$enums.RequestTypes.RISC_PROVVIGIONI:
        toReturn = this.wallet.currMonthCommissions ?? 0;

        break;
      case this.$enums.RequestTypes.COMMISSION_MANUAL_ADD:
        toReturn = this.formData.availableAmount || 0;

        break;
    }

    return toReturn;
  }

  get conversationId() {
    return this.formData.conversation?.id
  }

  get showAlert() {
    const statuses = [
      this.$enums.RequestStatus.LAVORAZIONE,
      this.$enums.RequestStatus.RIFIUTATA,
      this.$enums.RequestStatus.ANNULLATA
    ];

    return this.formData.status ? statuses.includes(this.formData.status) : false
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

  get firstMustTakeCharge() {
    return this.$store.getters["user/userIsAdmin"]
      && this.formData.status === RequestStatus.NUOVA
      && [RequestTypes.VERSAMENTO, RequestTypes.RISC_CAPITALE].includes(this.formData.type as number)
      && [RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(this.formData.status as number)
  }

  get canApprove() {
    if (!this.formData.status) {
      return false
    }

    const isNewRequest = this.$enums.RequestStatus.NUOVA === +this.formData.status;
    const isInProgress = this.$enums.RequestStatus.LAVORAZIONE === +this.formData.status;
    // const ownByAdmin = isInProgress && ownByCurrentUser.value;

    return (isNewRequest || isInProgress)
      && this.$store.getters["user/userIsAdmin"]
      && !this.formData.autoWithdrawlAll
  }

  get canCancelAutoWithdrawlAll() {
    if (!this.formData.status) {
      return false
    }

    const isInProgress = this.$enums.RequestStatus.LAVORAZIONE === +this.formData.status;
    const isAuthUserRequest = this.$auth.user.id === this.formData.userId;
    const reqHasAutoWithdrawl = this.formData.autoWithdrawlAll

    return isInProgress && isAuthUserRequest && reqHasAutoWithdrawl;
  }

  get canDelete() {
    return this.formData.id
      && this.formData.userId === this.$auth.user.id
      && this.formData.status === this.$enums.RequestStatus.NUOVA

  }

  get canEdit() {
    if (!this.formData.requestState) {
      return false
    }

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

  get userRefAgent() {
    return this.reqData?.user?.referenceAgentData?.id
  }

  get showNewAgentCommunication() {
    if (!this.userRefAgent) {
      return false
    }

    return this.$store.getters["user/userIsAdmin"]
  }

  close() {
    this.$refs.dialogForm?.reset();
    this.$store.dispatch("dialog/updateStatus", false);
  }

  async onDelete() {
    const result = await this.actions?.delete(this.formData as any);

    if (result) {
      this.close();

      this.$emit("requestDeleted");
    }
  }

  async onApprove() {
    const result = await (!this.firstMustTakeCharge ? this.actions?.approve(this.formData as any) : this.actions?.takeCharge(this.formData as any))

    if (result) {
      this.close();

      this.$emit("requestStatusChanged");
    }
  }

  async onReject() {
    const result = await this.actions?.reject(this.formData as any);

    if (result) {
      this.close();

      this.$emit("requestStatusChanged");
    }
  }

  async onCancelAutoWithdrawlAll() {
    const result = await this.actions?.cancelAutoWithdrawlAll(this.formData as any);

    if (result) {
      const user = this.$auth.user;

      this.$auth.setUser({
        ...user,
        autoWithdrawlAll: null,
        autoWithdrawlAllRecursively: null
      })

      this.close();

      this.$emit("requestStatusChanged");
    }
  }

  async onFormSubmit() {
    try {
      if (!(await this.$refs.dialogForm.validate(false))) {
        return;
      }

      const data = {
        amount: this.formData.amount,
        goldAmount: this.formData.goldAmount,
        userId: this.$auth.user.id,
        type: this.formData.type,
        wallet: this.formData.wallet,
        currency: this.formData.currency,
        notes: this.formData.notes,
        requestAttachment: this.formData.requestAttachment,
        autoWithdrawlAll: this.formData.autoWithdrawlAll,
        autoWithdrawlAllRecursively: this.formData.autoWithdrawlAllRecursively
      };

      if ((data.amount || 0) <= this.wallet.interestAmount
        && data.type === this.$enums.RequestTypes.RISC_CAPITALE) {
        try {
          await this.$alerts.ask({
            html: `Per l'importo richiesto è consigliabile effettuare una <strong>Riscossione Rendite</strong> riducendo i tempi di attesa.
            Vuole convertire questa richiesta in Riscossione Rendite?`,
            confirmButtonText: "Si, converti in Riscossione rendite",
            cancelButtonText: "No, procedi con Prelievo deposito"
          })

          await this.close();

          await this.$router.replace("/requests#new_collect_interests")

          return
        } catch (er) {
          // procede con la richiesta
        }
      }

      const reqTypeFormatted = this.$t("enums.RequestTypes." + this.$enums.RequestTypes.get(data.type).id)

      await this.$alerts.askBeforeAction({
        key: "send-request",
        settings: {
          html: this.$t(`alerts.send-request${data.autoWithdrawlAll ? `-all${data.autoWithdrawlAllRecursively ? '-recursive' : ''}` : ""}-text`, {
            ...data,
            type: reqTypeFormatted,
            amount: "€ " + moneyFormatter(data.amount)
          }) as string
        },
        preConfirm: async () => {
          const result: any = await this.$apiCalls.createRequest(data);

          if (data.autoWithdrawlAll) {
            const user = this.$auth.user;
            const newUser = {
              ...user,
              autoWithdrawlAll: result.id,
              autoWithdrawlAllRecursively: data.autoWithdrawlAllRecursively ? result.id : null
            }

            this.$auth.setUser(newUser)
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
            moneyFormatter(data.amount)
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

  async mounted() {
    this.actions = new RequestsTableActions(this);

    /*
    If the request has a status different from new, don't try to fetch the user's wallet
    because it will use the availableAmount stored in the request
    */
    if (this.incomingData.id) {
      try {
        const reqData: Record<string, any> = await this.$apiCalls.readRequest(this.incomingData.id)

        this.reqData = reqData

        for (let key in reqData) {
          this.$set(this.formData, key, reqData[key])
        }

        this.dataLoaded = true
      } catch (er) {
        this.$alerts.error(er)
        this.close()
      }

      return;
    }

    const data: any = {};

    if (this.$store.getters["user/userIsAdmin"]) {
      data.userId = this.formData.userId;
    }

    await this.$store.dispatch("user/updateWallets", {apiCalls: this.$apiCalls, data});

    this.formData.type = this.incomingData.type
    this.formData.gold = this.$auth.user.gold
    this.formData.clubPack = this.$auth.user.clubPack

    this.dataLoaded = true
  }
}
</script>
