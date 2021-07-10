<template>
  <div>
    <portal to="dialog-content">
      <v-tabs centered grow
              v-model="reqType"
              background-color="blue-grey lighten-5">
        <v-tab>Aggiungi</v-tab>
        <v-tab>Rimuovi</v-tab>
      </v-tabs>

      <dynamic-fieldset :schema="formSchema" v-model="formData" fill-row ref="form"></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="onClose" :disabled="gLoading || loading">
        {{ $t(dialogData.texts.cancelBtn) }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="onSubmit" :loading="gLoading || loading">
        {{ $t(dialogData.texts.confirmBtn) }}
      </v-btn>
    </portal>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import {DynamicForm} from "~/@types/DynamicForm";
import agentBriteAddSchema from "~/config/forms/agentBriteAddSchema";
import {User} from "~/@types/UserFormData";
import AgentBritesType from "~/enums/AgentBritesType";

interface IncomingData {
  user: User,
  maxValue: number
}

@Component({
  components: {DynamicFieldset: DynamicFieldset as any}
})
export default class AgentBriteAddDialog extends Vue {
  loading = false;
  formData = {
    availableAmount: 0,
    amount: null,
    motivation: "",
    type: 0
  }
  reqType = "add"

  $refs!: {
    form: HTMLElement & DynamicForm
  }

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get incomingData(): IncomingData {
    return this.dialogData.data
  }

  get formSchema() {
    return agentBriteAddSchema(this as any);
  }

  get maxValue() {
    return this.incomingData.maxValue;
  }

  get user() {
    return this.incomingData.user;
  }

  onClose() {
    try {
      this.$store.dispatch("dialog/updateStatus", false);
    } catch (er) {
      console.error(er)
    }
  }

  async onSubmit() {
    try {
      if (!(await this.$refs.form.validate())) {
        return;
      }

      this.loading = true
      await this.$apiCalls.agentBriteApi[this.formData.type](this.formData, this.user.id);

      //await this.$store.dispatch("magazine/fetch")

      this.onClose()
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      this.loading = false
    }
  }

  @Watch("reqType")
  onTypeChange(value) {
    this.$store.dispatch("dialog/updateData", {
      title: this.$t("dialogs.agentBriteAddDialog.title-" + (value === 0 ? "add" : "remove"))
    })

    this.formData.type = value === 0 ? AgentBritesType.MANUAL_ADD : AgentBritesType.MANUAL_REMOVE
  }

  @Watch("maxValue", {immediate: true})
  onMaxValueChange(value) {
    this.formData.availableAmount = value
  }
}
</script>
