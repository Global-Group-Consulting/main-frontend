<template>
  <v-list>
    <v-list-item v-for="(event, i) in events" :key="event.name + '_' + i" class="ps-0">
      <v-list-item-icon class="me-3">
        <v-icon small>mdi-checkbox-blank-circle</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title v-html="event.name"></v-list-item-title>
        <v-list-item-subtitle v-html="getSubtitle(event)"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
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
  setup (props) {
    function getSubtitle (event: CalendarEvent) {
      return moment(event.start).format('ddd DD, HH:mm')
    }

    return {
      getSubtitle
    }
  }
})
</script>

<style scoped>

</style>
