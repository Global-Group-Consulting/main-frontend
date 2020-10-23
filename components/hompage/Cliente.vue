<template>
  <div>
    <activation-wizard v-if="userMustActivate"
                       class="mb-5"
    />

    <dashboard-blocks></dashboard-blocks>

    <div style="width: 100%; gap: 14px" class="d-flex">
      <v-card
        width="70%"
        class="text-center my-5"
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
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Grafico from '@/components/charts/Grafico'
import ActivationWizard from '@/components/hompage/activationWizard/ActivationWizard'
import clientDashboardChart from '@/config/charts/clientDashboard'
import DashboardBlocks from '~/components/DashboardBlocks'

export default {
  name: 'Cliente',
  components: { DashboardBlocks, Grafico, ActivationWizard },
  data () {
    return { clientDashboardChart }
  },
  computed: {
    ...mapGetters({
      userMustActivate: 'user/mustActivate'
    }),
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
