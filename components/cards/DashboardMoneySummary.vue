<template>
  <DashboardBasicCard :tabs.sync="tabs" canFilter></DashboardBasicCard>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'

import DashboardBasicCard from '~/components/cards/DashboardBasicCard.vue'
import SystemTotals from '~/components/cards/tabs/SystemTotals.vue'
import CommissionsTotal from '~/components/cards/tabs/CommissionsTotal.vue'

export default defineComponent({
  name: 'DashboardMoneySummary',
  components: { DashboardBasicCard },
  setup () {
    const tabs: Ref<DynamicTab[]> = ref([
      {
        id: 'systemTotals',
        title: 'Entrate / Uscite',
        component: SystemTotals,
        mustReload: false,
        loading: true,
        filters: {}
      }, {
        id: 'commissionsTotals',
        title: 'Provvigioni',
        component: CommissionsTotal,
        mustReload: false,
        loading: true,
        filters: {}
      }
    ] as DynamicTab[])

    return {
      tabs
    }
  }
})
</script>

<style scoped>

</style>
