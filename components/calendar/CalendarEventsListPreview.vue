<template>
  <v-card class="text-left flex-grow-1 d-flex flex-column overflow-auto h-100">
    <v-card-text class="d-flex align-center pt-5">
      <h2 class="lh-1 grey--text text--darken-2" v-html="title || 'Prossimi eventi'"/>

      <v-btn text to="/calendar" class="ms-auto" color="primary" small>
        Apri
        <v-icon class="ms-2">mdi-calendar</v-icon>
      </v-btn>
    </v-card-text>

    <CalendarEventsList :events="events"
                        class="flex-grow-1 overflow-auto"
                        @eventClick="data => calendar.showEvent(data, false)"
                        style="height: 160px"
    ></CalendarEventsList>

    <!-- CalendarEventPreview is loaded from CalendarPreview component
     due to singleton architecture of calendar.activeEvent composable-->
  </v-card>
</template>

<!-- List used to show the list of events, in readonly mode. Any action will open calendar page -->
<script lang="ts">
import { defineComponent, onBeforeMount, ref } from '@vue/composition-api'
import { useCalendar } from '~/composables/useCalendar'

export default defineComponent({
  name: 'CalendarEventsListPreview',
  props: {
    events: {
      type: Array,
      default: () => ([])
    },
    title: {
      type: String
    }
  },
  events: ['update:activeEvent'],
  setup (props, { root, emit }) {
    const calendar = useCalendar(root.$apiCalls, root.$alerts, root.$store)
    const calendarFilters = {
      start: (new Date()).toISOString()
    }
    const calendarPagination = {
      sortBy: ['start'],
      sortDesc: [false]
    }

    async function fetchCalendarEvents () {
      await calendar.filterData(true, calendarFilters, calendarPagination)
    }

    onBeforeMount(async () => {
      await fetchCalendarEvents()
    })

    return {
      calendar,
      calendarFilters,
      calendarPagination
    }
  }
})
</script>

<style scoped>

</style>
