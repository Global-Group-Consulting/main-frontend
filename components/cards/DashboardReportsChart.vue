<template>
  <DashboardBasicCard :tabs.sync="tabs" can-filter></DashboardBasicCard>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'
import RefundChart from '~/components/cards/tabs/RefundChart.vue'
import AsyncAutocomplete from '~/components/forms/inputs/AsyncAutocomplete.vue'
// @ts-ignore
import { VSelect } from 'vuetify/lib'
import WithdrawalDepositChart from '~/components/cards/tabs/WithdrawalDepositChart.vue'
import WithdrawalInterestsChart from '~/components/cards/tabs/WithdrawalInterestsChart.vue'

export default defineComponent({
  name: 'DashboardReportsChart',
  setup (props, { root }) {
    const usersFilter = {
      key: 'userId',
      default: () => undefined,
      message: (value: string) => 'Utente: ' + value,
      component: AsyncAutocomplete,
      componentOptions: {
        label: 'Utente',
        clearable: true,
        asyncFn: (search: string) => root.$apiCalls.selectOptions.getUsersList(search)
      }
    }

    const tabs: Ref<DynamicTab[]> = ref([
      {
        id: 'refundReport',
        title: 'Classifica Rimborsi',
        component: RefundChart,
        mustReload: false,
        loading: true,
        filters: {},
        extraFiltersSchema: [
          usersFilter, {
            key: 'fromClub',
            default: () => undefined,
            message: (value) => 'Provenienza: ' + (value ? 'Club' : 'Standard'),
            component: VSelect,
            componentOptions: {
              label: 'Provenienza',
              clearable: true,
              items: [
                {
                  text: 'Club',
                  value: true
                }, {
                  text: 'Standard',
                  value: false
                }
              ]
            }
          }
        ]
      }, {
        id: 'depositWithdrawalReport',
        title: 'Classifica Prelievo deposito',
        component: WithdrawalDepositChart,
        mustReload: false,
        loading: true,
        filters: {},
        extraFiltersSchema: [usersFilter]
      }, {
        id: 'interestWithdrawalReport',
        title: 'Classifica Riscossione Rendite',
        component: WithdrawalInterestsChart,
        mustReload: false,
        loading: true,
        filters: {},
        extraFiltersSchema: [usersFilter]
      }
    ] as DynamicTab[])

    return { tabs }
  }
})
</script>

<style scoped>

</style>
