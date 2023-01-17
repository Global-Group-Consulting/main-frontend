<template>
  <v-layout>
    <v-flex>
      <PageHeader page-name="calendar"></PageHeader>

      <PageToolbar :actions-list="actionsList"></PageToolbar>

      <v-row class="my-5">
        <v-col sm="12" md="8">
          <v-card flat outlined>
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
                        append-icon="mdi-chevron-down"></v-select>
            </v-card-text>

            <v-card-text>
              <v-calendar ref="calendar"
                          :type="calType"
                          v-model="calValue"
                          :weekdays="[1,2,3,4,5,6,0]"
                          locale="it-IT"
                          :events="events"
                          :event-color="getEventColor"
                          @change="calendarChange"
              ></v-calendar>

            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="12" md="4">
          <v-card>
            <v-card-text>
              <h2 class="lh-1 my-3 " v-html="calTitle"></h2>

              <CalendarEventsList :events="events"></CalendarEventsList>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from '@vue/composition-api'
import { ActionItem } from '~/@types/ActionItem'
import moment from 'moment-timezone'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import CalendarEventsList from '~/components/lists/CalendarEventsList.vue'
import calendarEventsList from '~/components/lists/CalendarEventsList.vue'

export default defineComponent({
  name: 'Calendar',
  components: {
    CalendarEventsList
  },
  setup (props, { root }) {
    const { $apiCalls } = root
    const calendar = ref()
    const calType = ref('month')
    const calValue = ref('')
    const currentMonth = ref('')
    const actionsList: ComputedRef<ActionItem[]> = computed(() => {
      return [
        {
          text: 'calendar.add-event',
          tooltip: 'calendar.add-event-tooltip',
          position: 'center',
          icon: 'mdi-calendar-plus',
          options: {
            color: 'primary'
          }
        }
      ]
    })

    const events: Ref<CalendarEvent[]> = ref([
      {
        name: 'Event 1',
        description: 'Event 1 description',
        start: '2023-01-01T19:30',
        end: '2023-01-01T21:30',
        color: 'primary',
        timed: true,
        category: 'pippo'
      },
      {
        name: 'Event 2',
        description: 'Event 2 description',
        start: '2023-01-06T19:30',
        end: '2023-01-06T21:30',
        color: 'success',
        timed: true,
        category: 'event'
      },
      {
        name: 'Event 3',
        description: 'Event 3 description',
        start: '2023-01-06T19:30',
        end: '2023-01-06T21:30',
        color: 'primary',
        timed: false,
        category: 'pluto'
      },
      {
        name: 'Event 4',
        description: 'Event 4 description',
        start: '2023-01-20T19:30',
        end: '2023-01-20T21:30',
        color: 'success',
        timed: true,
        category: 'pluto'
      }, {
        name: 'Event 5',
        description: 'Event 5 description',
        start: '2023-01-30T19:30',
        end: '2023-01-30T21:30',
        color: 'secondary',
        timed: true,
        category: 'pluto'
      }
    ])

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

    function setToday () {
      calValue.value = ''
    }

    function next () {
      calendar.value.next()
    }

    function prev () {
      calendar.value.prev()
    }

    function calendarChange (e: any) {
      currentMonth.value = e.start.date
    }

    function getEventColor (event: CalendarEvent) {
      return event.color
    }

    async function fetchData () {
      events.value = await $apiCalls.calendarEventsApi.all()
    }

    todo:: le date devono essere inviate con la timezone dell'utnete che sta creando l'evento
    A db poi viene salvato con utc 0.

    onMounted(async () => {
      calendar.value.checkChange()

      await fetchData()
    })

    return {
      events,
      calendar,
      calValue,
      actionsList,
      currentMonth,
      setToday,
      next,
      prev,
      calendarChange,
      getEventColor,
      calType,
      calTitle,
      availableCalTypes
    }
  }
})
</script>

<style scoped>

</style>
