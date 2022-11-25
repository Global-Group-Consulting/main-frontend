<template>
  <div>
    <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from '@vue/composition-api'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import DashboardCardList, { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import { SystemTotalsOutDto } from '~/@types/dto/statistics/SystemTotalsDto'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'

export default defineComponent({
  name: 'SystemTotalsOut',
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
        id: 'withdrewDeposit',
        title: '',
        subtitle: 'Deposito prelevato',
        icon: 'mdi-bank-transfer-out',
        color: 'red'
      }, {
        id: 'withdrewInterests',
        title: '',
        subtitle: 'Rendite riscosse (Classic)',
        icon: 'mdi-bank-minus',
        color: 'orange'
      }, {
        id: 'briteWithdrewInterests',
        title: '',
        subtitle: 'Rendite riscosse (GOLD)',
        icon: 'mdi-diamond-stone',
        color: '#d4973b'
      }, {
        id: 'goldWithdrewInterests',
        title: '',
        subtitle: 'Rendite riscosse (Oro fisico)',
        icon: 'mdi-gold',
        color: '#d4973b'
      }
    ])
    const dashboardTabLogic = useDashboardTabLogic<SystemTotalsOutDto>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getSystemTotalsOut(props.filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {
      sections.value.forEach(section => {
        section.title = '€ ' + moneyFormatter(newData[section.id as keyof SystemTotalsOutDto] || 0)
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
