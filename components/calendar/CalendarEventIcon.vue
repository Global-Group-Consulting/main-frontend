<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <text-icon class="me-1" :x-small="xSmall"
                 v-bind="attrs"
                 v-on="on"
                 :color="color"
      >{{ calendarUtilities.getIcon(event) }}
      </text-icon>
    </template>
    <span>{{ calendarUtilities.getUsers(event) }}</span>
  </v-tooltip>


</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { useCalendarUtilities } from '~/composables/useCalendarUtilities'

export default defineComponent({
  name: 'CalendarEventIcon',
  props: {
    event: {
      type: Object as PropType<CalendarEvent>,
      required: true
    },
    xSmall: Boolean,
    color: String
  },
  setup () {
    const calendarUtilities = useCalendarUtilities()

    return {
      calendarUtilities
    }
  }
})
</script>

<style scoped>

</style>
