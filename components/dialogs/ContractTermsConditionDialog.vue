<template>
  <portal to="dialog-content">
    <div>
      <ol>
        <li>Con la presente scrittura, la parte depositaria si impegna a utilizzare il deposito per i fini annessi alla
          sua impresa, elargendo al depositante una percentuale mensile pari al {{ contractPercentage }}%
        </li>
        <li>Le Parti di comune accordo stabiliscono che eventuali aumenti di deposito prevedano sempre l’applicazione
          della percentuale come da punto 1.
        </li>
        <li>Il corrispettivo avverrà tramite consegna di oro fisico da investimento, o in altre modalità comunicate di
          volta in volta dall’affidante.
        </li>
        <li>Il corrispettivo verrà calcolato dal primo del mese utile successivo alla data del versamento.</li>
      </ol>

      <br>
      <br>

      <h3>OBBLIGHI INFORMATIVI</h3>
      <br>

      <p>
        Il depositario adotterà adeguati sistemi di contabilità e di controllo fornendo al depositante le seguenti
        informazioni:
      </p>

      <ul>
        <li>Tabella riepilogativa che rifletta l’andamento degli interessi su base mensile, dovutamente ricalcolata in
          base ad eventuali richieste di svincolo.
        </li>
      </ul>
    </div>
  </portal>
</template>

<script lang="ts">
import {Vue} from "vue-property-decorator";
import Component from "vue-class-component";

@Component
export default class ContractTermsConditionDialog extends Vue {
  get contractPercentage() {
    return this.$store.getters['dialog/dialogData'].data.contractPercentage
  }
}
</script>

<style scoped>

</style>
