<template>
  <DashboardBasicCard :tabs.sync="tabs" :canFilter="false"></DashboardBasicCard>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'
import UsersStatus from '~/components/cards/tabs/UsersStatus.vue'
import NewUsersCount from '~/components/cards/tabs/NewUsersCount.vue'

export default defineComponent({
  name: 'DashboardUsersStatus',
  setup (props, { root }) {
    const tabs: Ref<DynamicTab[]> = ref([
      {
        id: 'usersStatus',
        title: 'Stato Utenti',
        component: UsersStatus,
        mustReload: false,
        loading: true,
        filters: {}
      },{
        id: 'newUsersCount',
        title: 'Nuovi Utenti',
        component: NewUsersCount,
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
