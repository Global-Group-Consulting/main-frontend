<template>
  <div ref="test">
    <portal to="dialog-content" ref="dialogContent">
      <v-row>
        <v-col md="6" class="text-center">
          <a href="https://play.google.com/store/apps/details?id=global.app" target="_blank" class="d-inline-block">
            <img src="/global_club/google-store.png" alt="Download from Google Play store" style="max-width: 200px"/>
          </a>
        </v-col>
        <v-col md="6" class="text-center">
          <a href="https://apps.apple.com/it/app/globalclub/id1499467842" target="_blank"  class="d-inline-block">
            <img src="/global_club/app-store.png" alt="Download from App store"  style="max-width: 200px"/>
          </a>
        </v-col>
      </v-row>

      <v-img src="/global_club/use_brite.jpg" eager :options="{}"></v-img>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="onClose" :disabled="gLoading">
        {{ $t("dialogs.briteUseDialog.btn-cancel") }}
      </v-btn>
      <!--      <v-btn color="success" @click="onSubmit" :loading="gLoading">
              {{ $t("dialogs.briteUseDialog.btn-send") }}
              <v-icon class="ml-2">mdi-send</v-icon>
            </v-btn>-->
    </portal>
  </div>
</template>

<script lang="ts">
import briteUseSchema from "~/config/forms/briteUseSchema";
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
export default class BriteUseDialog extends Vue {
  public formData: any = {
    availableAmount: this.availableAmount,
    amount: 0,
    notes: ""
  }

  $refs!: {
    dialogForm: any
  }

  get formSchema() {
    return briteUseSchema(this.formData)
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

      await this.$alerts.askBeforeAction({
        key: "brite-use",
        preConfirm: async () => {
          const result = await $apiCalls.clubUseBrites(userId, this.formData);

          this.$emit("briteRequestSent", result)
          this.onClose();
        },
        settings: {},
        data: {
          amount: this.formData.amount
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
