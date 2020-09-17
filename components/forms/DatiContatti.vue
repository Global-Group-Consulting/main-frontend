<template>
  <v-card-text>
    <dynamic-fieldset :schema="fieldsSchema"
                      :value="initialData"
                      @input="$emit('input', $event )"/>
    <!-- <v-row>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="Email"
           v-model="formData.email"
           :disabled="userCheckingData"
         ></v-text-field>
       </v-col>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="Cellulare"
           v-model="formData.cellulare"
         ></v-text-field>
       </v-col>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="Telefono"
           v-model="formData.telefono"
         ></v-text-field>
       </v-col>
     </v-row>-->
  </v-card-text>
</template>

<script>
import { isEqual as _isEqual } from 'lodash'
import dataContacts               from '@/config/formBlocks/dataContacts'
import DynamicFieldset         from '@/components/DynamicFieldset'

export default {
  name:       'DatiContatti',
  components: { DynamicFieldset },
  data () {
    return {
      // Eseguo il binding direttamente sull'oggetto principale, in modo modificare i dati del genitore
      formData: {
        ...this.initialData
      }
    }
  },
  props:      {
    initialData:      {
      type: Object,
      default: () => ({})
    },
    userCheckingData: false
  },
  computed:   {
    fieldsSchema: dataContacts,
    dataHasChanged () {
      return !_isEqual(this.initialData, this.formData)
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
