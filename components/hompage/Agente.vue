<template>
  <div>
    <activation-wizard v-if="userMustActivate"
                       class="mb-5"
    />

    <v-card
      width="100%"
      class="text-center mb-5"
    >
      <v-card-text>
        <chart-lines
          :labels="clientDashboardChart.labels"
          :datasets="chartsClientDataset"
        />
      </v-card-text>
    </v-card>

    <v-card
      width="100%"
      class="text-center mb-5"
    >
      <v-card-text>
        <chart-lines
          :labels="agentDashboardChart.labels"
          :datasets="chartsAdminDataset"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Grafico from '@/components/charts/Grafico'
import ActivationWizard from '@/components/hompage/activationWizard/ActivationWizard'

import agentDashboardChart from '@/config/charts/agentDashboard'
import clientDashboardChart from '@/config/charts/clientDashboard'
import ChartLines from '@/components/charts/ChartLines'

export default {
  name: 'Cliente',
  components: { ChartLines, Grafico, ActivationWizard },
  data () {
    return {
      agentDashboardChart,
      clientDashboardChart
    }
  },
  computed: {
    ...mapGetters({
      userMustActivate: 'user/mustActivate'
    }),
    chartsAdminDataset () {
      return agentDashboardChart.datasets.map(set => {
        set.label = this.$t(set.label)

        return set
      })
    },
    chartsClientDataset () {
      return clientDashboardChart.datasets.map(set => {
        set.label = this.$t(set.label)

        return set
      })
    }
  }
}
</script>

<style scoped>

</style>
