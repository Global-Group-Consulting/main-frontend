<template>
  <div>
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
import requestSchema from "~/config/forms/agentRequestRepaymentSchema";
import {moneyFormatter} from "~/plugins/filters";
import {DynamicForm} from "~/@types/DynamicForm";
import {User} from "~/@types/UserFormData";
import {RequestFormData} from "~/@types/Requests";
import RequestTypes from "~/enums/RequestTypes";

@Component({
  components: {DynamicFieldset: DynamicFieldset as any},
})
export default class AdminRequestDialog extends Vue {
  formData: Partial<RequestFormData> = {
    amount: 0,
    availableAmount: 0,
    type: this.$enums.RequestTypes["VERSAMENTO"],
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

  get availableAmount() {
    return this.incomingData.maxValue;
  }

  get user(): User {
    return this.incomingData.user || {}
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
        type: RequestTypes.DEPOSIT_REPAYMENT,
        notes: this.formData.notes,
      };

      const reqTypeFormatted = this.$t("enums.RequestTypes." + this.$enums.RequestTypes.get(data.type).id)

      await this.$alerts.askBeforeAction({
        key: "send-agent-request-repayment",
        settings: {
          html: this.$t(`alerts.send-agent-request-repayment-text`, {
            ...data,
            type: reqTypeFormatted,
            amount: "€ " + moneyFormatter(data.amount),
            fullName: `${this.user.firstName} ${this.user.lastName}`

          }) as string
        },
        preConfirm: async () => {
          await this.$apiCalls.createAgentRequest(data);
        },
        data: {
          type: this.$t(
              "enums.RequestTypes." +
              this.$enums.RequestTypes.get(this.formData.type).id
          ),
          amount:
              this.$enums.CurrencyType.get("euro").symbol +
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

  async mounted() {
    this.formData.userId = this.user.id

    this.dataLoaded = true
  }
}
</script>
