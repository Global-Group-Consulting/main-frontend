<template>
  <DashboardBasicCard :tabs.sync="tabs" can-filter :outlined="outlined"></DashboardBasicCard>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'
import UsersStatus from '~/components/cards/tabs/UsersStatus.vue'
import NewUsersCount from '~/components/cards/tabs/NewUsersCount.vue'
import AgentNewUsersCount from '~/components/cards/tabs/AgentNewUsersCount.vue'
import AgentNewDepositsCount from '~/components/cards/tabs/AgentNewDepositsCount.vue'
import { useDatesSelectOptions } from '~/composables/datesSelectOptions'

export default defineComponent({
  name: 'DashboardAgentsChart',
  props: {
    outlined: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { root }) {
    const dateSelectOptions = useDatesSelectOptions()

    const tabs: Ref<DynamicTab[]> = ref([
      {
        id: 'agentNewUsersCount',
        title: 'Agenti - Nuovi clienti',
        component: AgentNewUsersCount,
        mustReload: false,
        loading: true,
        filters: { dates: dateSelectOptions.getSelectableDates()[1].value }
      }, {
        id: 'agentNewDepositsCount',
        title: 'Agenti - Nuovi versamenti',
        component: AgentNewDepositsCount,
        mustReload: false,
        loading: true,
        filters: { dates: dateSelectOptions.getSelectableDates()[1].value }
      }
    ] as DynamicTab[])

    return { tabs }
  }
})
</script>

<style scoped>

</style>
