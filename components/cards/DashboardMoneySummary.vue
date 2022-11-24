<template>
  <DashboardBasicCard :tabs.sync="tabs" canFilter></DashboardBasicCard>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'

import DashboardBasicCard from '~/components/cards/DashboardBasicCard.vue'
import CommissionsTotal from '~/components/cards/tabs/CommissionsTotal.vue'
import SystemTotalsIn from '~/components/cards/tabs/SystemTotalsIn.vue'
import SystemTotalsOut from '~/components/cards/tabs/SystemTotalsOut.vue'
import moment from 'moment'

export default defineComponent({
  name: 'DashboardMoneySummary',
  components: { DashboardBasicCard },
  setup () {
    const tabs: Ref<DynamicTab[]> = ref([
      {
        id: 'systemTotalsIn',
        title: 'Entrate',
        component: SystemTotalsIn,
        mustReload: false,
        loading: true,
        filters: {
          dates: [moment().format('YYYY-MM'), moment().format('YYYY-MM')]
        }
      }, {
        id: 'systemTotalsOut',
        title: 'Uscite',
        component: SystemTotalsOut,
        mustReload: false,
        loading: true,
        filters: {
          dates: [moment().format('YYYY-MM'), moment().format('YYYY-MM')]
        }
      }, {
        id: 'commissionsTotals',
        title: 'Provvigioni',
        component: CommissionsTotal,
        mustReload: false,
        loading: true,
        filters: {
          dates: [moment().format('YYYY-MM'), moment().format('YYYY-MM')]
        }
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
