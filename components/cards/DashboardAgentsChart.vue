<template>
  <DashboardBasicCard :tabs.sync="tabs" can-filter></DashboardBasicCard>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'
import UsersStatus from '~/components/cards/tabs/UsersStatus.vue'
import NewUsersCount from '~/components/cards/tabs/NewUsersCount.vue'
import AgentNewUsersCount from '~/components/cards/tabs/AgentNewUsersCount.vue'
import AgentNewDepositsCount from '~/components/cards/tabs/AgentNewDepositsCount.vue'

export default defineComponent({
  name: 'DashboardAgentsChart',
  setup (props, { root }) {
    const tabs: Ref<DynamicTab[]> = ref([
      {
        id: 'agentNewUsersCount',
        title: 'Agenti - Nuovi clienti',
        component: AgentNewUsersCount,
        mustReload: false,
        loading: true,
        filters: {}
      },{
        id: 'agentNewDepositsCount',
        title: 'Agenti - Nuovi versamenti',
        component: AgentNewDepositsCount,
        mustReload: false,
        loading: true,
        filters: {}
      }
    ] as DynamicTab[])

    return { tabs }
  }
})
</script>

<style scoped>

</style>
