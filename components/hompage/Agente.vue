<template>
  <div>
    <NewsBox></NewsBox>

    <v-row>
      <v-col cols="12" sm="6" md="8">
        <dashboard-blocks :dashboard-data="dashboardData" :loading="loading"
                          md="6" sm="12"
        ></dashboard-blocks>
      </v-col>
      <v-col cols="12" sm="6" md="4" class="d-flex flex-column overflow-auto">
        <v-card class="text-left my-3 flex-grow-1 d-flex flex-column overflow-auto h-100">
          <v-card-text class="d-flex align-center">
            <h2 class="lh-1 grey--text text--darken-2">
              Prossimi eventi
            </h2>

            <v-btn icon to="/calendar" class="ms-auto" color="primary">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </v-card-text>

          <CalendarEventsList :events="calendar.filteredEvents.value"
                              :page="calendar.filteredPagination.value.page"
                              :total-pages="calendar.filteredPagination.value.lastPage"
                              class="flex-grow-1 overflow-auto"
                              v-show="calendar.filteredPagination.value.total"
                              @load:more="calendar.loadMoreFilteredEvents(calendarFilters, calendarPagination)"
                              @eventClick="calendar.showEvent"
                              style="height: 160px"
          ></CalendarEventsList>

          <CalendarEventPreview
              :selected-element="calendar.activeEvent.value.selectedElement"
              :selected-event="calendar.activeEvent.value.selectedEvent"
              :left="calendar.activeEvent.value.left"
              :bottom="calendar.activeEvent.value.bottom"
              showAsPreview
          ></CalendarEventPreview>
        </v-card>
      </v-col>
    </v-row>

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
        <!--        <MagazineCard/>-->
      </v-col>
    </v-row>

    <!--    <v-card width="100%" class="text-center mb-5">
          <v-card-text>
            <chart-lines
              :labels="agentDashboardChart.labels"
              :datasets="chartsAdminDataset"
            />
          </v-card-text>
        </v-card>-->
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
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { useCalendar } from '~/composables/useCalendar'

export default defineComponent({
  name: 'Cliente',
  components: { MagazineCard, DashboardBlocks, ChartLines, Grafico },
  setup (props, { root }) {
    const { $apiCalls, $options, $moment, $alerts, $store } = root
    const calendar = useCalendar($apiCalls, $alerts, $store)
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
    const calendarFilters = {
      start: (new Date()).toISOString()
    }
    const calendarPagination = {
      sortBy: ['start'],
      sortDesc: [false]
    }

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
        set.label = label

        return set
      })
    })

    const chartsClientLabels = computed(() => {
      return clientDashboardChart.labels(
          dashboardData.charts.pastRecapitalizations
      )
    })

    async function fetchCalendarEvents () {
      await calendar.filterData(true, calendarFilters, calendarPagination)
    }

    onBeforeMount(async () => {
      fetchCalendarEvents().then()
      const result = await $apiCalls.dashboardFetch()

      root.$set(dashboardData, 'blocks', result.blocks)
      root.$set(dashboardData, 'charts', result.charts)

      loading.value = false
    })

    return {
      dashboardData, chartsClientDataset, chartsClientLabels,
      loading,
      calendar,
      calendarFilters,
      calendarPagination
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
        set.label = this.$t(set.label)

        return set
      })
    }
  }
})
</script>

<style scoped></style>
