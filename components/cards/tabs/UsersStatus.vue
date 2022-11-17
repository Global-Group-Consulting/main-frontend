<template>
  <div>
    <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import DashboardCardList, { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'
import AccountStatuses from '~/enums/AccountStatuses'
import { UserTotalsDto, UserTotalsKeys } from '~/@types/dto/statistics/UserTotalsDto'

export default defineComponent({
  name: 'UsersStatus',
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
        id: AccountStatuses.ACTIVE,
        title: '',
        subtitle: 'Attivi',
        icon: 'mdi-account-check',
        color: AccountStatuses.get(AccountStatuses.ACTIVE).color
      }, {
        id: 'pendingAccess',
        title: '',
        subtitle: 'Attesa accesso',
        icon: 'mdi-account-arrow-right',
        color: AccountStatuses.get(AccountStatuses.APPROVED).color
      }, {
        id: 'pendingSignature',
        title: '',
        subtitle: 'Attesa firma contratto',
        icon: 'mdi-account-edit',
        color: '#c2b441'
      }, {
        id: AccountStatuses.DRAFT,
        title: '',
        subtitle: 'Bozza',
        icon: 'mdi-account-outline',
        color: AccountStatuses.get(AccountStatuses.DRAFT).color
      }
    ])
    const dashboardTabLogic = useDashboardTabLogic<UserTotalsDto>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getUserStatuses(filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {

      sections.value.forEach((section) => {
        const currentSection = newData[section.id as UserTotalsKeys]
        let title = currentSection.count.toString()

        if (currentSection.suspended) {
          title += `<small class="font-italic"> (${currentSection.suspended} sospesi)</small>`
        }

        section.title = title
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
