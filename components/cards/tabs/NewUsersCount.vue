<template>
  <div>
    <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import AccountStatuses from '~/enums/AccountStatuses'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'
import { UserTotalsDto, UserTotalsKeys } from '~/@types/dto/statistics/UserTotalsDto'
import { NewUsersCountDto } from '~/@types/dto/statistics/NewUsersCountDto'

export default defineComponent({
  name: 'NewUsersCount',
  props: {
    mustReload: Boolean,
    loadingData: Boolean,
    filters: Object
  },
  setup (props, ctx) {
    const { $apiCalls, $i18n } = ctx.root
    const sections: Ref<DashboardCardListItem[]> = ref([
      {
        id: 'thisMonth',
        title: '0',
        subtitle: $i18n.t('filters.thisMonth') as string,
        textIcon: 'MC'
      }, {
        id: 'last3Months',
        title: '0',
        subtitle: $i18n.t('filters.last3Months') as string,
        textIcon: 'U3'
      }, {
        id: 'last6Months',
        title: '0',
        subtitle: $i18n.t('filters.last6Months') as string,
        textIcon: 'U6'
      }, {
        id: 'last12Months',
        title: '0',
        subtitle: $i18n.t('filters.last12Months') as string,
        textIcon: 'U12'
      }
    ])
    const dashboardTabLogic = useDashboardTabLogic<NewUsersCountDto>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getUsersCount(filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {

      sections.value.forEach((section) => {
        section.title = newData[section.id as keyof NewUsersCountDto].toString()
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
