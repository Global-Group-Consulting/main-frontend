<template>
  <v-card-text>
    <dynamic-fieldset :schema="fieldsSchema"
                      :value="initialData"
                      @input="$emit('input', $event )"/>
    <!-- <v-row>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="Numero Contratto"
           v-model="formData.numContratto"
         ></v-text-field>
       </v-col>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="Data Contratto"
           v-model="formData.dataContratto"
         ></v-text-field>
       </v-col>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="Percentuale"
           v-model="formData.percentuale"
         ></v-text-field>
       </v-col>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="IBAN cliente"
           v-model="formData.iban"
         ></v-text-field>
       </v-col>
       <v-col cols="12" sm="6" lg="4">
         <v-text-field
           label="BIC / SWIFT cliente"
           v-model="formData.bic"
         ></v-text-field>
       </v-col>
     </v-row>-->
  </v-card-text>
</template>

<script>
import DynamicFieldset from '@/components/DynamicFieldset'
import dataContract    from '@/config/formBlocks/dataContract'

export default {
  name:       'DataContract',
  components: { DynamicFieldset },
  data () {
    return {
      formData: { ...this.initialData }
    }
  },
  props:      {
    initialData: {
      type:    Object,
      default: () => ({})
    }
  },
  computed:   {
    fieldsSchema: dataContract
  }
}
</script>

<style scoped>

</style>
