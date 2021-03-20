<template>
  <div ref="test">
    <portal to="dialog-content" ref="dialogContent">
      <dynamic-fieldset
        :schema="formSchema"
        v-model="formData"
        fill-row
        ref="dialogForm"
      ></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="onClose" :disabled="gLoading">
        {{ $t("dialogs.briteRemoveDialog.btn-cancel") }}
      </v-btn>
      <v-btn color="success" @click="onSubmit" :loading="gLoading">
        {{ $t("dialogs.briteRemoveDialog.btn-send") }}
        <v-icon class="ml-2">mdi-send</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
import briteRemoveSchema from "~/config/forms/briteRemoveSchema";
import {Component, Vue} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import {CardBlockI} from "~/@types/components/CardBlock";
import {Moment} from "moment";

interface DialogData {
  card: CardBlockI,
  totalReport: {
    totalAmount: number,
    expirations: { amount: number, expiresAt: Moment }[]
  }
}


@Component({})
export default class BriteRemoveDialog extends Vue {
  public formData: any = {
    availableAmount: this.availableAmount,
    amountChange: 0,
    notes: ""
  }

  $refs!: {
    dialogForm: any
  }

  get formSchema() {
    return briteRemoveSchema(this.formData)
  }

  get dialogData(): { data: DialogData } {
    return this.$store.getters["dialog/dialogData"]
  }

  get availableAmount() {
    return this.dialogData.data.totalReport?.totalAmount || 0
  }

  onClose() {
    this.$store.dispatch("dialog/updateStatus", false);
  }

  async onSubmit() {
    const userId = this.$route.params.id
    const $apiCalls = this.$apiCalls

    try {
      if (!(await this.$refs.dialogForm.validate(false))) {
        return;
      }

      debugger

      await this.$alerts.askBeforeAction({
        key: "brite-remove",
        preConfirm: async () => {
          const result = await $apiCalls.clubRemoveBrites(userId, this.formData);

          this.$emit("briteRemoved", result)
          this.onClose();
        },
        settings: {},
        data: {
          amount: this.formData.amountChange
        }
      });
    } catch (er) {
      this.$alerts.error(er)
    }
  }
}
</script>

<style scoped>

</style>
