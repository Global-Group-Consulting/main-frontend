<template>
  <div>
    <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from '@vue/composition-api'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import DashboardCardList, { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import { SystemTotalsDto } from '~/@types/dto/statistics/SystemTotalsDto'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'

export default defineComponent({
  name: 'SystemTotals',
  components: { DashboardCardList },
  props: {
    mustReload: Boolean,
    loadingData: Boolean,
    filters: Object
  },
  setup (props, ctx) {
    const { $apiCalls } = ctx.root
    const sections: Ref<DashboardCardListItem[]> = ref([
      {
        id: 'deposit',
        title: '',
        subtitle: 'Deposito',
        icon: 'mdi-cloud-upload',
        color: 'blue'
      }, {
        id: 'interests',
        title: '',
        subtitle: 'Rendite',
        icon: 'mdi-chart-timeline-variant',
        color: 'green'
      }, {
        id: 'withdrewInterests',
        title: '',
        subtitle: 'Rendite riscosse (Classic)',
        icon: 'mdi-chart-sankey-variant',
        color: 'orange'
      }, {
        id: 'goldWithdrewInterests',
        title: '',
        subtitle: 'Rendite riscosse (GOLD)',
        icon: 'mdi-diamond-stone',
        color: '#d4973b'
      }, {
        id: 'withdrewDeposit',
        title: '',
        subtitle: 'Deposito prelevato',
        icon: 'mdi-cloud-download',
        color: 'red'
      }, {
        id: 'repayments',
        title: '',
        subtitle: 'Rimborsi',
        icon: 'mdi-cloud-alert',
        color: 'warning'
      }
    ])
    const dashboardTabLogic = useDashboardTabLogic<SystemTotalsDto>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getSystemTotals(props.filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {
      sections.value.forEach(section => {
        section.title = '€ ' + moneyFormatter(newData[section.id as keyof SystemTotalsDto] || 0)
      })
    })

    return {
      sections,
      hasError: dashboardTabLogic.hasError,
      loading: dashboardTabLogic.loading
    }
  }
})
</script>

<style scoped>

</style>
