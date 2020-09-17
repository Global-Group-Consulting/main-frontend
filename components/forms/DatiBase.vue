<template>
  <v-card-text :class="{'pt-0': !personaGiuridica}">
    <dynamic-fieldset :schema="fieldsSchema"
                      :value="initialData"
                      @input="$emit('input', $event )"/>


    <!--<v-row>
      <v-col cols="12" sm="6" lg="4">
        <v-select
          v-model="formData.tipoSoggetto"
          :items="enums.TipiSoggetti.iterable"
          label="Tipologia soggetto"
          :disabled="userCheckingData"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="personaGiuridica">
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Ragione Sociale"
          v-model="formData.ragioneSociale"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Partita IVA"
          v-model="formData.partitaIva"
        ></v-text-field>
      </v-col>
    </v-row>

    <h3 class="primary&#45;&#45;text mt-5" v-if="personaGiuridica">
      Rappresentante legale
    </h3>

    <v-row>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Nome"
          v-model="formData.nome"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Cognome"
          v-model="formData.cognome"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Codice Fiscale"
          v-model="formData.codiceFiscale"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-select
          v-model="formData.sesso"
          :items="enums.ElencoSesso.iterable"
          clearable
          label="Sesso"
        ></v-select>
      </v-col>
    </v-row>

    <h3 class="primary&#45;&#45;text mt-5">Dati nascita{{ personaGiuridica ? ' rappresentante legale' : '' }}</h3>
    <v-row>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Nazione di nascita"
          v-model="formData.nascitaNazione"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Provincia di nascita"
          v-model="formData.nascitaProvincia"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Città di nascita"
          v-model="formData.nascitaCitta"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <date-picker v-model="formData.nascitaData"
                     label="Data nascita"
                     :initial-date="$moment().subtract(18, 'years').format('YYYY-MM-DD')">
        </date-picker>
      </v-col>
    </v-row>

    <h3 class="primary&#45;&#45;text mt-5">Documenti indentificativi</h3>
    <v-row>
      <v-col cols="12" sm="6" lg="4">
        <v-select
          v-model="formData.documentoTipo"
          :items="documentsTypes"
          label="Tipo documento"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Numero documento"
          v-model="formData.documentoNumero"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <date-picker v-model="formData.documentoScadenza"
                     label="Data scadenza"
                     :min="$moment().format('YYYY-MM-DD')">
        </date-picker>
      </v-col>
    </v-row>-->
  </v-card-text>
</template>

<script>
import DatePicker      from '~/components/inputs/DatePicker'
import DynamicFieldset from '@/components/DynamicFieldset'

import dataBasic from '@/config/formBlocks/dataBasic'

export default {
  name:       'DatiBase',
  components: { DynamicFieldset, DatePicker },
  data () {
    return {
      // Eseguo il binding direttamente sull'oggetto principale, in modo modificare i dati del genitore
      enums: {
        TipiSoggetti,
        TipiDocumenti,
        ElencoSesso
      },
      menus: {
        dataNascita: false
      }
    }
  },
  props:      {
    initialData:      {
      type: Object,
      default () {
        return {}
      }
    },
    userCheckingData: false
  },
  computed:   {
    fieldsSchema: dataBasic,
    personaGiuridica () {
      return this.formData.tipoSoggetto === TipiSoggetti.GIURIDICA
    },
    documentsTypes () {
      return TipiDocumenti.iterable.reduce((acc, type) => {
        if (type.cat === 'identity') {
          acc.push({
            ...type,
            text: this.$t(`attachmentsTypes.${type.id}`)
          })
        }

        return acc
      }, [])
    }
  },
  watch:      {}
}
</script>

<style scoped>

</style>
