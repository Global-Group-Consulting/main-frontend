<template>
  <div>
    <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'
import { RefundReportDto } from '~/@types/dto/statistics/RefundReportDto'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import { WithdrawalInterestReportDto } from '~/@types/dto/statistics/WithdrawalInterestReportDto'

export default defineComponent({
  name: 'WithdrawalInterestsChart',
  props: {
    mustReload: Boolean,
    loadingData: Boolean,
    filters: Object
  },
  setup (props, ctx) {
    const { $apiCalls, $i18n } = ctx.root
    const sections: Ref<DashboardCardListItem[]> = ref([
      // dynamically created
    ])
    const dashboardTabLogic = useDashboardTabLogic<WithdrawalInterestReportDto[]>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getWithdrawalInterestReport(filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {
      sections.value = []

      newData.forEach((section) => {

        // dynamically create the sections for each user
        sections.value.push({
          id: section._id,
          title: `€ ${moneyFormatter(section.total)}`,
          subtitle: section.user.firstName + ' ' + section.user.lastName,
          textIcon: section.user.firstName[0] + section.user.lastName[0]
        })
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
