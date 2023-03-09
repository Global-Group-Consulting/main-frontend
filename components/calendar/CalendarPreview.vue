<template>
  <v-card class="d-flex flex-column calendar-card" height="700px">
    <!-- Calendar tooolbar -->
    <v-card-text class="pb-0 d-flex align-center">
              <span class="me-3">
                <tooltip-btn text outlined @click="setToday">Oggi</tooltip-btn>
              </span>
      <tooltip-btn icon icon-name="mdi-chevron-left" @click="prev"></tooltip-btn>
      <tooltip-btn icon icon-name="mdi-chevron-right" @click="next"></tooltip-btn>

      <h2 class="mb-0 ms-3 lh-1" v-html="calTitle"></h2>

      <v-spacer></v-spacer>

      <v-select outlined flat dense hide-details
                class="flex-grow-0"
                style="width: 150px"
                :items="availableCalTypes"
                v-model="calType"
                append-icon="mdi-chevron-down"
                :clearable="calType !== 'month'"
                @click:clear.prevent.stop="$nextTick(() => calType = 'month')"
      ></v-select>
    </v-card-text>

    <v-card-text class="flex-grow-1 overflow-hidden">
      <v-calendar ref="calendarDiv"
                  :type="calType"
                  v-model="calValue"
                  :weekdays="[1,2,3,4,5,6,0]"
                  :locale="$i18n.locale"
                  :events="events"
                  :event-color="getEventColor"
                  :event-more="true"
                  first-time="07:00"
                  :interval-count="24-7"
                  event-more-text="Altri"
                  @change="calendarChange"
                  @click:event="data => calendar.showEvent(data, true)"
                  @click:date="showDayDetails"
                  @click:more="showDayDetails"
      ></v-calendar>

      <CalendarEventPreview
          :selected-element="calendar.activeEvent.value.selectedElement"
          :selected-event="calendar.activeEvent.value.selectedEvent"
          :left="calendar.activeEvent.value.left"
          :bottom="calendar.activeEvent.value.bottom"
          @opened="scrollToEvent(calendar.activeEvent.value.selectedEvent._id)"
          show-as-preview
      ></CalendarEventPreview>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, nextTick, onMounted, Ref, ref, watch } from '@vue/composition-api'
import moment from 'moment-timezone'
import { Filter } from '~/@types/Filter'
import CalendarFiltersSchema from '~/config/forms/filters/calendarFiltersSchema'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { useCalendar } from '~/composables/useCalendar'

export default defineComponent({
  name: 'CalendarPreview',
  events: ['update:calTitle', 'update:visibleEvents'],
  props: {},
  setup (props, { root, emit }) {
    const calendar = useCalendar(root.$apiCalls, root.$alerts, root.$store)
    const calendarDiv = ref()
    const calType = ref('month')
    const calValue = ref('')
    const currentMonth = ref('')
    const events: Ref<CalendarEvent[]> = ref([])

    const availableCalTypes = [
      { text: 'Giorno', value: 'day' },
      { text: 'Settimana', value: 'week' },
      { text: 'Mese', value: 'month' }
    ]

    const calTitle = computed(() => {
      const date = moment(currentMonth.value)
      const toReturn = [date.format('MMMM yy')]

      if (calType.value === 'week') {
        toReturn.push(`<br><small class="subtitle-2">(${date.format('DD/MM')} - ${date.add(6, 'days').format('DD/MM')})</small>`)
      } else if (calType.value === 'day') {
        toReturn.push(`<br><small class="subtitle-2">(${date.format('dddd DD/MM')})</small>`)
      }

      return toReturn.join(' ')
    })

    const visibleEvents = computed(() => {
      return events.value.filter(e => {
        const start = moment(e.start)
        const end = moment(e.end)
        const current = moment(currentMonth.value)

        if (calType.value === 'month') {
          return start.isSame(current, 'month') || end.isSame(current, 'month')
        } else if (calType.value === 'week') {
          return start.isSame(current, 'week') || end.isSame(current, 'week')
        } else if (calType.value === 'day') {
          return start.isSame(current, 'day') || end.isSame(current, 'day')
        }
      })
    })

    function setToday () {
      calValue.value = ''

      nextTick(() => {
        fetchData()
      })
    }

    function next () {
      calendarDiv.value.next()

      nextTick(() => {
        fetchData()
      })
    }

    function prev () {
      calendarDiv.value.prev()

      nextTick(() => {
        fetchData()
      })
    }

    function calendarChange (e: any) {
      currentMonth.value = e.start.date
    }

    function getEventColor (event: CalendarEvent) {
      return event.category?.color ?? 'primary'
    }

    function showDayDetails (ev: any) {
      calType.value = 'day'
      calValue.value = ev.date
    }

    function scrollToEvent (eventId: string) {
      if (calendar.activeEvent.value.setFromCalendar || calType.value === 'month') {
        return
      }

      const event = events.value.find(e => e._id === eventId)

      if (event) {
        nextTick(() => {
          calendarDiv.value.scrollToTime(moment(event.start).format('HH:mm'))
        })
      }

      emit('update:toHighlight')
    }

    async function fetchData () {
      const start = moment(calendarDiv.value.lastStart.date).startOf('month').format('YYYY-MM-DD')
      const end = moment(calendarDiv.value.lastEnd.date).endOf('month').format('YYYY-MM-DD')

      try {
        events.value = (await root.$apiCalls.calendarEventsApi.all({ start, end })) as CalendarEvent[]

        if (calendar.activeEvent.value.selectedEvent?._id) {
          const foundEvent = events.value.find(e => e._id === calendar.activeEvent.value.selectedEvent._id)

          if (foundEvent) {
            calendar.activeEvent.value.selectedEvent = foundEvent
          }
        }
      } catch (e) {
        root.$alerts.error(e)
      }
    }

    /**
     * Watch visibleEvents change and emit an update:visibleEvents event
     */
    watch(() => visibleEvents.value, (value) => {
      emit('update:visibleEvents', value)
    }, { immediate: true, deep: true })

    /**
     * Watch calTitle change and emit an update:calTitle event
     */
    watch(() => calTitle.value, (value) => {
      emit('update:calTitle', value)
    }, { immediate: true, deep: true })

    watch(() => calendar.activeEvent.value.selectedEvent, (value: any) => {
      if (!value || calType.value === 'month') {
        return
      }

      scrollToEvent(value._id)
    }, { deep: true })

    onMounted(async () => {
      calendarDiv.value.checkChange()

      await fetchData()
    })

    return {
      events,
      visibleEvents,
      calendarDiv,
      calendar,
      calValue,
      currentMonth,
      calType,
      calTitle,
      availableCalTypes,
      setToday,
      next,
      prev,
      calendarChange,
      getEventColor,
      showDayDetails,
      scrollToEvent
    }
  }
})
</script>

<style scoped>

</style>
