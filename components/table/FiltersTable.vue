<template>
  <data-table
    :items="filteredData"
    :items-per-page="25"
    :table-key="tableKey"
    :schema="schema"
    light
  >

  </data-table>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {usersFiltersFieldsMap} from "~/config/forms/filters/usersFiltersSchema";
import {User} from "~/@types/UserFormData";

import DataTable from "./DataTable.vue";

@Component({
  components: {
    DataTable: DataTable as any
  }
})
export default class FiltersTable extends Vue {
  @Prop({type: String})
  tableKey!: string

  @Prop({type: String})
  schema!: string

  @Prop({type: Object})
  filtersMap!: any // Oggetto con la mappa dei filtri

  @Prop({type: Array})
  dataToFilter!: any[]

  get activeFilters() {
    return this.$store.getters["filters/activeFilters"]
  }

  get filteredData(): any[] {
    if (!this.activeFilters || Object.keys(this.activeFilters).length === 0) {
      return []
    }

    // Array di tutte le chiavi da ricercare
    const activeFiltersKeys = Object.keys(this.activeFilters)

    // Prendo tutti i dati disponibili e attivo il filter
    const filteredData = this.dataToFilter.filter((data) => {
      const matchedFilters = []

      // per ogni chiave presente in activeFilters
      for (let activeKey of activeFiltersKeys) {

        // Chiavi mappate dove cercare nei dati dell'utente
        const mappedKeysToSearchIn: string[] | ((data: any, searchValue: any) => boolean) = this.filtersMap[activeKey];


        // Valore da ricercare per la chiave corente
        const filterValue = this.activeFilters[activeKey];

        // Chiavi mappate il cui valore è valido
        const matchedMappedKeys = [];

        if (typeof mappedKeysToSearchIn === "function") {
          const result = mappedKeysToSearchIn(data, filterValue)

          if (result) {
            matchedMappedKeys.push([activeKey])
          }
        } else {
          // Per ogni chiave presente in "mappedKeysToSearchIn"
          for (let mappedKey of mappedKeysToSearchIn) {
            // Tipologia del valore da ricercare
            const type = typeof filterValue;

            // Valore presente del dato da ricercare che corrisponde alla mappedKey
            let dataValue = data[mappedKey];

            if (type === "boolean" && !dataValue) {
              dataValue = false
            }

            // Variabile dove salvare se questa specifica chiave con il suo valore è valido.
            let result = true

            // Se dataValue è null o undefined lo ignora e passa alla chiave successiva
            if ([null, undefined].includes(dataValue)) {
              continue
            }

            // In base al type del valore da ricercare, esegue le varie ricerche.
            switch (type) {
              case "string":
                result = !!dataValue.toString().toLowerCase()
                  .match(filterValue.toLowerCase().trim());

                break;
              case "boolean":
                result = dataValue === filterValue

                break;
              case "number":
                result = dataValue === filterValue

                break;
              default:

            }

            if (result) {
              matchedMappedKeys.push([mappedKey, dataValue])
            }
          }
        }

        if (matchedMappedKeys.length > 0) {
          matchedFilters.push(activeKey)
        }
      }

      return activeFiltersKeys.length === matchedFilters.length
    })

    this.$store.dispatch("filters/updateFilteredData", filteredData)

    return filteredData
  }

  @Watch("filteredData", {deep: true})
  onDataChange() {

  }
}
</script>

<style scoped>

</style>
