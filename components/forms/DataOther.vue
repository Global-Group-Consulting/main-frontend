<template>
  <v-card-text>
    <dynamic-fieldset :schema="fieldsSchema"
                      :value="initialData"
                      @input="$emit('input', $event )"/>

    <!--<v-row>
      <v-col cols="12" sm="6" lg="4">
        <v-select
          v-model="formData.ruolo"
          :items="$enums.UserRoles.iterable"
          label="Ruolo"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="4"
             v-if="showAgenteRiferimento">
        <v-text-field
          label="Agente di riferimento"
          v-model="formData.agenteRiferimento"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="formData.userId">
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Data creazione account"
          readonly
            :value="formData.dataCreazione|dateFormatter(true)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Data attivazione account"
          readonly
          :value="formData.dataVerificaEmail|dateFormatter(true)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          label="Data ultima modifica dati"
          readonly
          :value="formData.dataUltimaModifica|dateFormatter(true)"
        ></v-text-field>
      </v-col>
    </v-row>-->
  </v-card-text>
</template>

<script>
import RuoliUtenti     from 'assets/enums/ruoli'
import dataOther       from '@/config/formBlocks/dataOther'
import DynamicFieldset from '@/components/DynamicFieldset'

export default {
  name:     'DataOther',
  components: { DynamicFieldset },
  data () {
    return {
      formData: { ...this.initialData }
    }
  },
  props:    {
    initialData: {
      type:    Object,
      default: () => ({})
    }
  },
  computed: {
    fieldsSchema: dataOther,
    showAgenteRiferimento () {
      return [RuoliUtenti.CLIENTE, RuoliUtenti.AGENTE].includes(this.formData.ruolo)
    }
  }
}
</script>

<style scoped>

</style>
