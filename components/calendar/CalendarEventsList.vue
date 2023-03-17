<template>
  <div class="d-flex flex-column">
    <v-list v-if="events && events.length" class="flex-grow-1 overflow-auto">
      <v-list-item v-for="(event, i) in events" :key="event.name + '_' + i"
                   class=""
                   @click="onEventClick(event, $event)">
        <v-list-item-icon class="me-3">
          <CalendarEventIcon :event="event" :color="calendarUtilities.getColor(event)"></CalendarEventIcon>
        </v-list-item-icon>

        <v-list-item-content class="overflow-visible">
          <v-list-item-title class="overflow-visible">
            <v-badge left color="error" v-if="event.unreadComments.length"
                     icon="mdi-comment-alert" class="mt-0">
              <span v-html="calendarUtilities.getTitle(event)" class="text-wrap"></span>
            </v-badge>

            <span v-else v-html="calendarUtilities.getTitle(event)" class="text-wrap"></span>
          </v-list-item-title>
          <v-list-item-subtitle v-html="getSubtitle(event)"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="totalPages > 1 && page < totalPages">
        <v-list-item-content>
          <v-btn outlined color="primary" @click="$emit('load:more')">
            Carica altri eventi
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-alert outlined color="warning" class="mx-4" v-else>Nessun evento per il periodo selezionato</v-alert>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import TextIcon from '~/components/elements/TextIcon.vue'
import moment from 'moment-timezone'
import { useCalendarUtilities } from '~/composables/useCalendarUtilities'

export default defineComponent({
  name: 'CalendarEventsList',
  components: { TextIcon },
  props: {
    events: {
      type: Array as PropType<CalendarEvent[]>,
      required: true
    },
    page: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  emits: ['load:more'],
  setup (props, { emit }) {
    const calendarUtilities = useCalendarUtilities()

    function getSubtitle (event: CalendarEvent) {
      const start = moment(event.start)
      const end = moment(event.end)

      let toReturn = [start.format('ddd, D MMM'), '|', start.format('HH:mm'), '-', end.format('HH:mm')]

      if (!start.isSame(end, 'day')) {
        toReturn = [start.format('ddd, D MMM HH:mm'), '|', end.format('ddd, D MMM HH:mm')]
      }

      return toReturn.join(' ')
    }

    function onEventClick (event: CalendarEvent, nativeEvent: MouseEvent) {
      emit('eventClick', { nativeEvent, event, left: true })
    }

    return {
      calendarUtilities,
      getSubtitle,
      onEventClick
    }
  }
})
</script>

<style scoped>

</style>
