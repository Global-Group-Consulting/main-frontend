<template>
  <div>
    <DashboardCardList :items="sections" :has-error="hasError" :loading="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from '@vue/composition-api'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import DashboardCardList, { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'
import { SystemTotalsInDto } from '~/@types/dto/statistics/SystemTotalsDto'
import { useDashboardTabLogic } from '~/composables/dashboardTabLogic'
import MovementTypes from '~/enums/MovementTypes'

export default defineComponent({
  name: 'SystemTotalsIn',
  components: { DashboardCardList },
  props: {
    mustReload: Boolean,
    loadingData: Boolean,
    filters: Object
  },
  setup (props, ctx) {
    const { $apiCalls, $i18n } = ctx.root

    const sections: Ref<DashboardCardListItem[]> = ref([
      {
        id: 'depositTotal',
        title: '',
        subtitle: 'Deposito',
        icon: 'mdi-chart-bell-curve-cumulative',
        color: 'blue',
        tooltip: 'Somma Deposito Chiusura mensile'
      },
      {
        id: 'interestsTotal',
        title: '',
        subtitle: 'Rendite',
        icon: 'mdi-chart-bell-curve',
        color: 'green',
        tooltip: 'Somma Interessi Chiusura mensile'
      },
      {
        id: 'deposit',
        title: '',
        subtitle: 'Nuovo Deposito',
        icon: 'mdi-bank-transfer-in',
        color: 'indigo lighten-2',
        details: []
      }, {
        id: 'interests',
        title: '',
        subtitle: 'Rendite Reinvestite',
        icon: 'mdi-bank-transfer',
        color: 'teal lighten-2'
      }

    ])
    const dashboardTabLogic = useDashboardTabLogic<SystemTotalsInDto>(ctx, props, sections)

    dashboardTabLogic.setFetchFunction(async (filters) => {
      return $apiCalls.statisticsApi.getSystemTotalsIn(props.filters)
    })

    dashboardTabLogic.setOnDataChange((newData) => {

      sections.value.forEach(section => {
        section.title = '€ ' + moneyFormatter(newData[section.id as keyof Omit<SystemTotalsInDto, 'details'>] || 0)

        if (section.details && newData.details) {
          // section.details.splice(0, section.details.length-1)
          // reset current details
          section.details = []

          Object.keys(newData.details).forEach(key => {
            // store original key for safety reasons
            const originalKey = key

            // Store the details app if any
            const app = originalKey.split('_')[1]

            // update the key by removing extra info
            key = originalKey.split('_')[0]

            const value = newData.details[originalKey as any]
            const typeId = +(MovementTypes.get(key).index as any)
            let mustPush = false

            if (section.id === 'deposit' && MovementTypes.IN_DEPOSIT_TYPES.includes(typeId)) {
              mustPush = true
            } else if (section.id === 'interests' && [...MovementTypes.IN_INTEREST_TYPES, MovementTypes.INTEREST_RECAPITALIZED].includes(typeId)) {
              mustPush = true
            }

            if (mustPush) {
              section.details?.push({
                id: originalKey,
                title: '€ ' + moneyFormatter(value),
                subtitle: $i18n.t('enums.MovementTypes.' + key) as string + (app ? ' ' + app : ''),
                textIcon: ' '
                // color: section.color
              })
            }
          })
        }
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
