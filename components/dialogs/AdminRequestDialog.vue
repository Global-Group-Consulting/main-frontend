<template>
  <div>
    <portal to="dialog-pre-content">
      <v-alert outlined
               type="warning"
               prominent
               tile
               border="right"
               v-if="!hideAlert">
        <p class="mb-0"
           v-html="$t('dialogs.adminRequestDialog.alert-msg', {fullName: `${this.user.firstName} ${this.user.lastName}`})"></p>
      </v-alert>
    </portal>

    <portal to="dialog-content">
      <v-skeleton-loader
        :loading="!dataLoaded"
        type="list-item-two-line@4"
      >
        <v-form @submit.prevent="">
          <dynamic-fieldset
            ref="dialogForm"
            :schema="formSchema"
            v-model="formData"
            fill-row
          />
        </v-form>
      </v-skeleton-loader>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn text @click="close">
        {{ $t(`dialogs.requests.btn-cancel`) }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="onFormSubmit" v-if="dataLoaded">
        {{ $t("dialogs.requests.btn-send") }}
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import requestSchema from "~/config/forms/adminRequestSchema";
import {moneyFormatter} from "~/plugins/filters";
import {DynamicForm} from "~/@types/DynamicForm";
import {User} from "~/@types/UserFormData";
import {RequestFormData} from "~/@types/Requests";

@Component({
  components: {DynamicFieldset: DynamicFieldset as any},
})
export default class AdminRequestDialog extends Vue {
  formData: Partial<RequestFormData> = {
    amount: 0,
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

  get wallet() {
    return this.$store.getters["user/availableWallets"].find(
      (_wallet: any) => _wallet.type === (this.formData.wallet || 1)
    );
  };

  get availableAmount() {
    if (this.formData.status !== this.$enums.RequestStatus.NUOVA && this.formData.id) {
      return this.formData.availableAmount;
    }

    let toReturn = 0;

    switch (this.formData.type) {
      case this.$enums.RequestTypes.RISC_CAPITALE:
      case this.$enums.RequestTypes.VERSAMENTO:
      case this.$enums.RequestTypes.DEPOSIT_REPAYMENT:
        toReturn = this.wallet.deposit ?? 0;

        break;
      case this.$enums.RequestTypes.RISC_INTERESSI:
      case this.$enums.RequestTypes.RISC_MANUALE_INTERESSI:
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

  get user(): User {
    return this.incomingData.user || {}
  }

  get hideAlert() {
    return this.formData.type && [this.$enums.RequestTypes.DEPOSIT_REPAYMENT, this.$enums.RequestTypes.RISC_MANUALE_INTERESSI].includes(this.formData.type)
  }

  close() {
    this.$refs.dialogForm?.reset();
    this.$store.dispatch("dialog/updateStatus", false);
  }

  async onFormSubmit() {
    try {
      if (!(await this.$refs.dialogForm.validate(false)) || !this.formData.amount) {
        return;
      }

      const data = {
        amount: this.formData.amount,
        userId: this.user.id,
        type: this.formData.type,
        wallet: this.formData.wallet,
        currency: this.formData.currency,
        notes: this.formData.notes,
        requestAttachment: this.formData.requestAttachment,
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
        key: "send-admin-request",
        settings: {
          html: this.$t(`alerts.send-admin-request-text`, {
            ...data,
            type: reqTypeFormatted,
            amount: "€ " + moneyFormatter(data.amount),
            fullName: `${this.user.firstName} ${this.user.lastName}`

          }) as string
        },
        preConfirm: async () => {
          await this.$apiCalls.createAdminRequest(data);
        },
        data: {
          type: this.$t(
            "enums.RequestTypes." +
            this.$enums.RequestTypes.get(this.formData.type).id
          ),
          amount:
            this.$enums.CurrencyType.get(data.currency).symbol +
            " " +
            moneyFormatter(data.amount),
        }
      });

      this.$emit("newRequestAdded", data);

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
    const reqText = this.$enums.RequestTypes.getIdName(value)
    const reqTranslation = this.$t("enums.RequestTypes." + reqText)

    this.formData.wallet =
      ![this.$enums.RequestTypes.RISC_PROVVIGIONI, this.$enums.RequestTypes.COMMISSION_MANUAL_ADD].includes(value)
        ? this.$enums.WalletTypes.DEPOSIT
        : this.$enums.WalletTypes.COMMISION;

    this.formData.currency = this.$enums.CurrencyType.EURO;

    this.$store.dispatch("dialog/updateData", {
      title: this.$t("dialogs.adminRequestDialog.title", {request: reqTranslation}),
    })
  }

  async mounted() {
    this.formData.type = this.incomingData.type
    this.formData.gold = this.user.gold
    this.formData.clubPack = this.user.clubPack
    this.formData.userId = this.user.id

    await this.$store.dispatch("user/updateWallets", {
      apiCalls: this.$apiCalls,
      data: {
        userId: this.formData.userId
      }
    });

    this.dataLoaded = true
  }
}
</script>
