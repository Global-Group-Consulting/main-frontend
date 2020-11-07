<template>
  <div>
    <activation-wizard v-if="userMustActivate"
                       class="mb-5"
    />

    <dashboard-blocks></dashboard-blocks>

    <div style="width: 100%; gap: 14px" class="d-flex">
      <v-card
        width="70%"
        class="text-center my-5 flex-fill"
      >
        <v-card-text>
          <chart-lines
            :labels="clientDashboardChart.labels"
            :datasets="chartsClientDataset"
          />
        </v-card-text>
      </v-card>

      <v-card class="my-5" width="30%">
        <v-card-text class="d-flex">
          <a href="/GGM_7_dash.pdf" target="_blank"
          style="width: 100%">
            <v-img src="/GGM_7_dash.jpg"
                   width="100%"
                   contain
                   class=""
            ></v-img>
          </a>
        </v-card-text>

      </v-card>
    </div>

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
import DashboardBlocks from '~/components/DashboardBlocks'

export default {
  name: 'Cliente',
  components: { DashboardBlocks, ChartLines, Grafico, ActivationWizard },
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
