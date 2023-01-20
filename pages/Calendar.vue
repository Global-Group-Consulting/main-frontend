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
                          @click:event="showEvent"
                          @click:date="createEvent"
              ></v-calendar>

              <CalendarEventPreview
                  :selected-element="activeEvent.selectedElement"
                  :selected-event="activeEvent.selectedEvent"
                  @event-deleted="onEventDeleted"
              ></CalendarEventPreview>

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

      <CalendarEventUpsertDialog
          v-if="$store.getters['dialog/dialogId'] === 'CalendarEventUpsertDialog'"
          @event-created="onEventCreated"
          @event-updated="onEventUpdated"
      />

      <CalendarCategoriesDialog
          v-if="$store.getters['dialog/dialogId'] === 'CalendarCategoriesDialog'"
      />

    </v-flex>
  </v-layout>


</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, reactive, Ref, ref } from '@vue/composition-api'
import { ActionItem } from '~/@types/ActionItem'
import moment from 'moment-timezone'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import CalendarEventsList from '~/components/calendar/CalendarEventsList.vue'
import CalendarEventPreview from '~/components/calendar/CalendarEventPreview.vue'

export default defineComponent({
  name: 'Calendar',
  components: {
    CalendarEventsList, CalendarEventPreview
  },
  setup (props, { root }) {
    const { $apiCalls, $store, $i18n, $alerts } = root
    const calendar = ref()
    const calType = ref('month')
    const calValue = ref('')
    const currentMonth = ref('')
    const activeEvent = reactive({
      selectedEvent: {},
      selectedElement: null
    })
    const actionsList: ComputedRef<ActionItem[]> = computed(() => {
      return [
        {
          text: 'calendar.add-event',
          tooltip: 'calendar.add-event-tooltip',
          position: 'center',
          icon: 'mdi-calendar-plus',
          options: {
            color: 'primary'
          },
          click: createEvent
        },
        {
          text: 'calendar.view-categories',
          tooltip: 'calendar.view-categories-tooltip',
          position: 'center',
          icon: 'mdi-shape',
          options: {
            color: 'secondary'
          },
          click: viewCategories
        }
      ]
    })

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
      return event.color ?? 'primary'
    }

    function showEvent ({ nativeEvent, event }: any) {
      activeEvent.selectedEvent = event
      activeEvent.selectedElement = nativeEvent.target
    }

    function createEvent (date: any) {
      const start = moment(date.date).add(1, 'hour')
      const end = start.clone().add(1, 'hour')

      $store.dispatch('dialog/updateStatus', {
        id: 'CalendarEventUpsertDialog',
        title: $i18n.t('dialogs.calendarEventDialog.title-add') as string,
        texts: {
          cancelBtn: 'dialogs.calendarEventDialog.btn-cancel',
          confirmBtn: 'dialogs.calendarEventDialog.btn-add'
        },
        data: {
          event: {
            name: 'Nuovo evento',
            start,
            end
          }
        }
      })
    }

    function viewCategories () {
      $store.dispatch('dialog/updateStatus', {
        id: 'CalendarCategoriesDialog',
        title: $i18n.t('dialogs.calendarCategoriesDialog.title') as string,
        texts: {
          cancelBtn: 'dialogs.calendarCategoriesDialog.btn-cancel',
          confirmBtn: 'dialogs.calendarCategoriesDialog.btn-confirm'
        }
      })
    }

    function onEventCreated (event: CalendarEvent) {
      $alerts.toastSuccess('alerts.calendarEvents.crate-success')
      fetchData()
    }

    function onEventUpdated (event: CalendarEvent) {
      $alerts.toastSuccess('alerts.calendarEvents.update-success')
      fetchData()
    }

    function onEventDeleted (event: CalendarEvent) {
      fetchData()
    }

    async function fetchData () {
      events.value = await $apiCalls.calendarEventsApi.all()
    }

    /*
        todo:: le date devono essere inviate con la timezone dell'utnete che sta creando l'evento
        A db poi viene salvato con utc 0.*/

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
      activeEvent,
      calType,
      calTitle,
      availableCalTypes,
      setToday,
      next,
      prev,
      calendarChange,
      getEventColor,
      onEventCreated,
      onEventUpdated,
      onEventDeleted,
      showEvent,
      createEvent
    }
  }
})
</script>

<style scoped>

</style>
