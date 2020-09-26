<template>
  <div>
    <activation-wizard v-if="userMustActivate"
                       class="mb-5"
    />

    <v-row dense>
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
    </v-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Grafico from '@/components/charts/Grafico'
import ActivationWizard from '@/components/hompage/activationWizard/ActivationWizard'
import clientDashboardChart from '@/config/charts/clientDashboard'

export default {
  name: 'Cliente',
  components: { Grafico, ActivationWizard },
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
