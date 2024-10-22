<template>
  <div>
    <NewsBox></NewsBox>

    <v-row class="my-5">
      <v-col sm="12" md="8">
        <CalendarPreview @update:visibleEvents="visibleEvents = $event"
                         @update:calTitle="calendarTitle = $event"
        ></CalendarPreview>
      </v-col>

      <v-col sm="12" md="4">
        <CalendarEventsListPreview :events="visibleEvents" :title="calendarTitle"></CalendarEventsListPreview>
      </v-col>
    </v-row>

    <dashboard-blocks :dashboard-data="dashboardData" :loading="loading"
                      md="6" sm="12" lg="3"
    ></dashboard-blocks>

    <v-row class="my-5">
      <v-col sm="12" md="8">
        <v-card class="text-center">
          <v-card-text>
            <chart-lines
                :labels="chartsClientLabels"
                :datasets="chartsClientDataset"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="4">
        <MagazineCard/>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Grafico from '@/components/charts/Grafico.vue'

import agentDashboardChart from '@/config/charts/agentDashboard'
import clientDashboardChart from '@/config/charts/clientDashboard'
import ChartLines from '@/components/charts/ChartLines.vue'
import DashboardBlocks from '~/components/DashboardBlocks.vue'

import { onBeforeMount, reactive, ref, computed, Ref, defineComponent } from '@vue/composition-api'
import MagazineCard from '~/components/dashboard/MagazineCard.vue'
import CalendarPreview from '~/components/calendar/CalendarPreview.vue'
import CalendarEventsListPreview from '~/components/calendar/CalendarEventsListPreview.vue'

export default defineComponent({
  name: 'Agente',
  components: { CalendarPreview, CalendarEventsListPreview, MagazineCard, DashboardBlocks, ChartLines, Grafico },
  setup (props, { root }) {
    const { $apiCalls, $options, $moment, $alerts, $store } = root
    const monthsToShow = ref(12)
    const dashboardData = reactive({
      blocks: {
        deposit: 0,
        interestAmount: 0,
        depositCollected: 0,
        interestsCollected: 0
      },
      charts: {
        pastRecapitalizations: [] as any[]
      }
    })
    const loading = ref(true)
    const visibleEvents = ref([])
    const calendarTitle = ref('')
    const calendarActiveEvent = ref(null)

    const chartsClientDataset = computed(() => {
      const data: any = {
        deposit: [],
        interestAmount: [],
        'charts.picket-deposit': [],
        'charts.picked-interests': []
      }

      const futureData: any[] = []

      const lastRealRecapitalization: any = dashboardData.charts.pastRecapitalizations[0]

      for (let i = 0; i < 6; i++) {
        let newDeposit = 0
        let newInterest = 0
        let amountChange = 0
        let lastDate = null

        if (!lastRealRecapitalization) {
          break
        }

        if (futureData.length === 0) {
          lastDate = lastRealRecapitalization.created_at
          amountChange = dashboardData.blocks.interestAmount
          newDeposit = dashboardData.blocks.deposit + amountChange
          newInterest = newDeposit * lastRealRecapitalization.interestPercentage / 100
        } else {
          lastDate = futureData[futureData.length - 1].created_at
          amountChange = futureData[futureData.length - 1].interestAmount
          newDeposit = futureData[futureData.length - 1].deposit + amountChange
          newInterest = newDeposit * lastRealRecapitalization.interestPercentage / 100
        }

        futureData.push({
          amountChange: amountChange,
          created_at: $moment(lastDate).add(1, 'months').toISOString(),
          deposit: newDeposit,
          interestAmount: newInterest,
          interestPercentage: lastRealRecapitalization.interestPercentage,
          userId: lastRealRecapitalization.userId
        })
      }

      if (futureData.length > 0) {
        dashboardData.charts.pastRecapitalizations.unshift(...futureData.reverse())
      }

      for (const _data of dashboardData.charts.pastRecapitalizations) {
        if (data.deposit.length >= monthsToShow.value) {
          break
        }

        data.deposit.push(_data.deposit.toFixed(2))
        data.interestAmount.push(_data.interestAmount.toFixed(2))
      }

      return clientDashboardChart.datasets.map(set => {
        const label = root.$t(`charts.current-${set.id}`)

        set.data = (data[set.id] || []).reverse()
        set.label = label as string

        return set
      })
    })

    const chartsClientLabels = computed(() => {
      return clientDashboardChart.labels(
          dashboardData.charts.pastRecapitalizations
      )
    })

    onBeforeMount(async () => {
      const result = await $apiCalls.dashboardFetch()

      root.$set(dashboardData, 'blocks', result.blocks)
      root.$set(dashboardData, 'charts', result.charts)

      loading.value = false
    })

    return {
      dashboardData, chartsClientDataset, chartsClientLabels,
      loading,
      visibleEvents,
      calendarTitle,
      calendarActiveEvent
    }
  },
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
        set.label = this.$t(set.label)  as string

        return set
      })
    }
  }
})
</script>

<style scoped></style>
