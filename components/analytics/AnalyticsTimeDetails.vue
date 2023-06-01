<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import humanizeDuration from 'humanize-duration'
import { IAnalytics, ITimer } from '~/composables/analytics'

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    item: {
      type: Object as PropType<IAnalytics>,
      default: () => ({}),
      required: true
    }
  },
  setup () {

    function formatDuration (seconds: number) {
      return humanizeDuration(seconds * 1000, {
        language: 'it',
        largest: 2,
        units: ['d', 'h', 'm', 's'],
        round: true
      })
    }

    function formatTimers (timers: ITimer[][]): ITimer[] {
      const toReturn: Record<string, ITimer & { totalTime?: number }> = {}

      timers.map(timer => {
        timer.forEach(t => {
          if (!toReturn[t.pageName]) {
            toReturn[t.pageName] = t
          }

          const totalTime = toReturn[t.pageName].totalTime || 0

          toReturn[t.pageName].totalTime = totalTime + t.timeOnPage
        })
      })

      return Object.values(toReturn).sort((a: ITimer, b: ITimer) => a.pageName.localeCompare(b.pageName))
    }

    return {
      formatDuration,
      formatTimers
    }
  }
})

</script>

<template>
  <CardTooltip :title="formatDuration(value)" :close-on-content-click="false">
    <v-list dense>
      <v-list-item v-for="timer in formatTimers(item.timers)" :key="timer.pageName"
                   style="min-height: 30px">
        <v-list-item-content>
          <small><strong>{{ timer.pageName }}</strong>: {{
              formatDuration(timer.timeOnPage)
            }}</small>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </CardTooltip>
</template>

<style scoped lang="scss">

</style>
