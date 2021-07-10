<template>
  <div>
    <portal to="dialog-content">
      <p>Gentile <strong>{{ incomingData.userName }}</strong>,<br>
        per richiedere l'utilizzo dei proprio brite la invitiamo ad inviare una richiesta tramite email all'indirizzo
        <a :href="'mailto:' + requestBriteEmail + '?subject=Richiesta utilizzo Brite Agente'">{{ requestBriteEmail }}</a>.
      </p>
      <p>Le ricordiamo che l'importo massimo della sua richiesta non dovrà superare <strong>Br' {{ this.incomingData.maxValue|moneyFormatter(true) }}</strong></p>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="onClose" :disabled="gLoading || loading">
        {{ $t(dialogData.texts.cancelBtn) }}
      </v-btn>
      <!--      <v-btn color="blue darken-1" text @click="onSubmit" :loading="gLoading || loading">
              {{ $t(dialogData.texts.confirmBtn) }}
            </v-btn>-->
    </portal>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import magazineSchema from "~/config/forms/magazineSchema";
import {DynamicForm} from "~/@types/DynamicForm";
import {FormMagazineCreate, IMagazine} from "~/@types/Magazine";
import {User} from "~/@types/UserFormData";

interface IncomingData {
  userName: string,
  maxValue: number
}

@Component({
  components: {DynamicFieldset: DynamicFieldset as any}
})
export default class AgentBriteUseDialog extends Vue {
  loading = false;
  dateFormat = "YYYY-MM-DD";
  magazine: Partial<IMagazine> = {}
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

  get requestBriteEmail() {
    return this.$store.getters["settings/globalSettings"].requestBriteEmail
  }

  onClose() {
    try {
      this.$store.dispatch("dialog/updateStatus", false);
    } catch (er) {
      console.error(er)
    }
  }


  async mounted() {

  }
}
</script>
