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

export default defineComponent({
  name: 'AgentNewUsersCount',
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
    const dashboardTabLogic = useDashboardTabLogic<RefundReportDto[]>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getRefundReport(filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {
      sections.value = []

      newData.forEach((section) => {
        if(!section.user){
          return
        }

        // show details only if there are more than 1 item
        const showDetails = section.totals.length > 1
        let title = '€ ' + moneyFormatter(section.totalSum)
        let subtitle = [section.user.firstName + ' ' + section.user.lastName]

        // if showDetails is true, we have to show the details of the different totals
        if (showDetails) {
          const str = section.totals.map((el) => `€ ${moneyFormatter(el.total)}${el.fromClub ? ' (club)' : ''}`)

          subtitle.unshift(str.join(' + '))
        } else if (section.totals[0].fromClub) {
          // if there is only one element 'and' it's from club, show it
          title += ' <em><small>(club)</small></em>'
        }

        // dynamically create the sections for each user
        sections.value.push({
          id: section._id,
          title: title,
          subtitle: subtitle.join('<br>'),
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
