<template>
  <v-card-text>
    <dynamic-fieldset :schema="fieldsSchema"
                      :value="initialData"
                      @input="$emit('input', $event )"/>
    <!--<v-row v-if="personaGiuridica">
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Nazione"
                v-model="formData.aziendaNazione"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Regione"
                v-model="formData.aziendaRegione"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Provincia"
                v-model="formData.aziendaProvincia"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Citta"
                v-model="formData.aziendaCitta"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="CAP"
                v-model="formData.aziendaCap"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Indirizzo"
                v-model="formData.aziendaIndirizzo"
        ></v-text-field>
      </v-col>
    </v-row>

    <h3 class="primary&#45;&#45;text mt-5" v-if="personaGiuridica">
      Residenza{{personaGiuridica ? ' rappresentante legale' : ''}}
    </h3>
    <v-row>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Nazione"
                v-model="formData.residenzaNazione"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Regione"
                v-model="formData.residenzaRegione"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Provincia"
                v-model="formData.residenzaProvincia"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Citta"
                v-model="formData.residenzaCitta"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="CAP"
                v-model="formData.residenzaCap"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
                label="Indirizzo"
                v-model="formData.residenzaIndirizzo"
        ></v-text-field>
      </v-col>
    </v-row>-->
  </v-card-text>
</template>

<script>
import TipiSoggetti    from '~/assets/enums/tipiSoggetti'
import dataAddress     from '@/config/formBlocks/dataAddress'
import DynamicFieldset from '@/components/DynamicFieldset'

export default {
  name:       'DatiIndirizzo',
  components: { DynamicFieldset },
  data () {
    return {
      // Eseguo il binding direttamente sull'oggetto principale, in modo modificare i dati del genitore
      formData: { ...this.initialData },
      enums:    {
        TipiSoggetti
      }
    }
  },
  props:      {
    initialData: {
      type:    Object,
      default: () => ({})
    }
  },
  computed:   {
    fieldsSchema: dataAddress,
    personaGiuridica () {
      return this.initialData.tipoSoggetto === TipiSoggetti.GIURIDICA
    }
  },
  watch:      {
    // formData (data) {
    //   this.$emit('change', data)
    // }
  }
}
</script>

<style scoped>

</style>
