<template>
  <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api'
import DashboardCardList, { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import { CommissionTotalsDto } from '~/@types/dto/statistics/CommissionTotalsDto'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'

export default defineComponent({
  name: 'CommissionsTotal',
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
        id: 'total',
        title: '',
        subtitle: 'Totali',
        icon: 'mdi-cash-multiple',
        color: 'primary'
      }, {
        id: 'withdrawn',
        title: '',
        subtitle: 'Riscosse',
        icon: 'mdi-cash-minus',
        color: 'red'
      }, {
        id: 'reinvested',
        title: '',
        subtitle: 'Reinvestite',
        icon: 'mdi-cash-refund',
        color: 'orange'
      }
    ])
    const dashboardTabLogic = useDashboardTabLogic<CommissionTotalsDto>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getCommissionTotals(props.filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {
      sections.value.forEach(section => {
        section.title = '€ ' + moneyFormatter(newData?.[section.id as keyof CommissionTotalsDto] || 0)
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
