<template>
  <div>
    <portal to="dialog-content">
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
import magazineSchema from "~/config/forms/magazineSchema";
import {DynamicForm} from "~/@types/DynamicForm";
import {FormMagazineCreate, IMagazine} from "~/@types/Magazine";

interface IncomingData {
  magazine: IMagazine,

  onConfirm(resp: any): void
}

@Component({
  components: {DynamicFieldset: DynamicFieldset as any}
})
export default class MagazineDialog extends Vue {
  loading = false;
  dateFormat = "YYYY-MM-DD";
  magazine!: IMagazine
  formData: FormMagazineCreate = {
    title: "",
    pdfFile: null,
    coverFile: null,
    publicationDate: "",
    showRange: [],
  }

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
    return magazineSchema(this as any);
  }

  get magazineId(): string {
    return this.incomingData.magazine?.id
  }

  get isNew(): boolean {
    return !this.incomingData.magazine
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
      await this.$apiCalls.magazine[this.magazine ? "update" : "create"](this.formData, this.magazine.id);

      await this.$store.dispatch("magazine/fetch")

      this.onClose()
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      this.loading = false
    }
  }

  @Watch("magazine", {deep: true, immediate: true})
  onMagazineChange(value: IMagazine) {
    this.formData.showRange = [this.$moment(value.showFrom).format(this.dateFormat), this.$moment(value.showUntil).format(this.dateFormat)]
    this.formData.title = value.title
    this.formData.publicationDate = this.$moment(value.publicationDate).format(this.dateFormat)
  }


  async mounted() {
    if (!this.magazineId) {
      this.formData.publicationDate = this.$moment().startOf("month").format(this.dateFormat)
      this.formData.showRange = [this.$moment().startOf("month").format(this.dateFormat), this.$moment().endOf("month").format(this.dateFormat)]

      return
    }

    try {
      // Temporary load the incoming one
      this.magazine = this.incomingData.magazine;

      // when available the fetched one, use that
      this.magazine = await this.$apiCalls.magazine.show(this.magazineId);
    } catch (er: any) {
      this.$alerts.error(er)
    }
  }
}
</script>
