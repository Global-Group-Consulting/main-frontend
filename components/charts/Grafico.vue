<template>
  <v-card :disabled="disabled">
    <v-card-title>
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-md-left">{{ label }}</div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="display-1 text-md-right">{{ labelValue|moneyFormatter }}</div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .05)">
        <chart-lines style="height: 250px"
                     :labels="['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno']"
                     :values="values"
        >
        </chart-lines>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
import ChartLines from '@/components/charts/ChartLines'

export default {
  name: 'Grafico',
  components: { ChartLines },
  data () {
    return {}
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    labelValue: {
      type: Number,
      default: 0
    },
    values: {
      type: Array,
      default: []
    },
    icon: {
      type: String
    },
    tipoGrafico: {
      type: String,
      default: 'trend'
    }
  }
}
</script>

<style scoped>

</style>
