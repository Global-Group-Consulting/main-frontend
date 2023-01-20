<template>
  <div>
    <v-list v-if="events && events.length">
      <v-list-item v-for="(event, i) in events" :key="event.name + '_' + i" class="ps-0"
                   @click="onEventClick(event, $event)">
        <v-list-item-icon class="me-3">
          <v-icon small :color="getIconColor(event)">mdi-checkbox-blank-circle</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-html="event.name"></v-list-item-title>
          <v-list-item-subtitle v-html="getSubtitle(event)"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-alert outlined color="warning" class="mt-4" v-else>Nessun evento per il periodo selezionato</v-alert>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import moment from 'moment-timezone'

export default defineComponent({
  name: 'CalendarEventsList',
  props: {
    events: {
      type: Array as PropType<CalendarEvent[]>,
      required: true
    }
  },
  setup (props, { emit }) {
    function getIconColor (event: CalendarEvent) {
      return event.category?.color || 'primary'
    }

    function getSubtitle (event: CalendarEvent) {
      return moment(event.start).format('ddd DD, HH:mm')
    }

    function onEventClick (event: CalendarEvent, nativeEvent: MouseEvent) {
      emit('eventClick', { nativeEvent, event, left: true })
    }

    return {
      getSubtitle,
      getIconColor,
      onEventClick
    }
  }
})
</script>

<style scoped>

</style>
