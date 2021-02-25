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

import DynamicFieldset from "~/components/DynamicFieldset.vue";
import AclCreateSchema from "~/config/forms/aclCreateSchema"

@Component({
  components: {}
})
export default class AclAddDialog extends Vue {
  public formData: any = {}

  $refs!: {
    dialogForm: any
  }

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get formSchema() {
    return AclCreateSchema(this)
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
    try {
      if (!(await this.$refs.dialogForm.validate(false))) {
        return;
      }

      const result = await this.$apiCalls[this.dialogData.data.submitAction](this.formData)

      this.$emit("aclAdded", result, this.dialogData.data.type)

      this.$alerts.toastSuccess("acl-create-success")

      this.close();
    } catch (er) {
      this.$alerts.error(er)
    }
  }
}
</script>

<style scoped>

</style>
