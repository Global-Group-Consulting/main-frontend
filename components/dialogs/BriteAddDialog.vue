<template>
  <div>
    <portal to="dialog-content">
      <dynamic-fieldset :schema="formSchema"
                        v-model="formData"
                        ref="dialogForm"
                        fill-row></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="blue darken-1" text @click="close"
             :disabled="gLoading">
        {{ $t(dialogData.texts.cancelBtn) }}
      </v-btn>

      <v-btn
        color="blue darken-1"
        text
        @click="onConfirm"
        :loading="gLoading"
      >
        {{ $t(dialogData.texts.confirmBtn) }}
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import briteAddSchema from "~/config/forms/briteAddSchema"
import {DynamicTab} from "~/@types/components/DynamicTab";

@Component({
  components: {}
})
export default class BriteAddDialog extends Vue {
  public formData = {
    amountChange: null,
    notes: "",
    semester: this.tabData.id
  }

  $refs!: {
    dialogForm: any
  }

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get formSchema() {
    return briteAddSchema()
  }

  get tabData(): DynamicTab {
    return this.dialogData.data
  }

  close() {
    try {
      this.$refs.dialogForm.reset()
      this.$store.dispatch("dialog/updateStatus", false);
    } catch (er) {
      console.error(er)
    }
  }

  async onConfirm() {
    const userId = this.$route.params.id
    const $apiCalls = this.$apiCalls

    try {
      if (!(await this.$refs.dialogForm.validate(false))) {
        return;
      }

      await this.$alerts.askBeforeAction({
        key: "brite-add",
        preConfirm: async () => {
          const result = await $apiCalls.clubAddBrites(userId, this.formData);

          this.$emit("briteAdded", result)
          this.close();
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
