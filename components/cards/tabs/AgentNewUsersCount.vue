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
import { AgentNewUsersCountDto } from '~/@types/dto/statistics/AgentNewUsersCountDto'

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
      /*{
        id: 'thisMonth',
        title: '0',
        subtitle: $i18n.t('filters.thisMonth') as string,
        textIcon: 'MC'
      }*/
    ])
    const dashboardTabLogic = useDashboardTabLogic<AgentNewUsersCountDto[]>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getAgentNewUsersCount(filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {
      sections.value = [];

      newData.forEach((section) => {
        // dynamically create the sections for each user
        sections.value.push({
          id: section._id,
          title: section.totalUsers.toString(),
          subtitle: section.agent.firstName + ' ' + section.agent.lastName,
          textIcon: section.agent.firstName[0] + section.agent.lastName[0]
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
