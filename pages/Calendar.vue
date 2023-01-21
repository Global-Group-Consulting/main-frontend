<template>
  <v-layout>
    <v-flex>
      <PageHeader page-name="calendar"></PageHeader>

      <PageToolbar :actions-list="actionsList"></PageToolbar>

      <v-row class="my-5">
        <v-col sm="12" md="8">
          <v-card flat outlined class="d-flex flex-column" height="700px">
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

            <v-card-text class="flex-grow-1 overflow-hidden">
              <v-calendar ref="calendar"
                          :type="calType"
                          v-model="calValue"
                          :weekdays="[1,2,3,4,5,6,0]"
                          :locale="$i18n.locale"
                          :events="events"
                          :event-color="getEventColor"
                          :event-more="true"
                          :categories="categories"
                          event-more-text="Altri"
                          @change="calendarChange"
                          @click:event="showEvent"
                          @click:date="createEvent"
                          @click:more="showMoreEvents"
              ></v-calendar>

              <CalendarEventPreview
                  :selected-element="activeEvent.selectedElement"
                  :selected-event="activeEvent.selectedEvent"
                  :left="activeEvent.left"
                  :bottom="activeEvent.bottom"
                  @event-deleted="onEventDeleted"
                  @close="onPreviewClose"
              ></CalendarEventPreview>

              <!--              <CalendarEventMore :more-events="moreEvents.events"
                                               :selected-element="moreEvents.selectedElement"
                            ></CalendarEventMore>-->

            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="12" md="4">
          <v-card height="100%" max-height="700px" flat outlined class="overflow-hidden">
            <v-card-text class="d-flex flex-column h-100">
              <h2 class="lh-1 my-3 " v-html="calTitle"></h2>

              <CalendarEventsList :events="visibleEvents"
                                  class="flex-grow-1 overflow-auto"
                                  @eventClick="showEvent"></CalendarEventsList>
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
import {
  computed,
  ComputedRef,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  Ref,
  ref,
  watch
} from '@vue/composition-api'
import { ActionItem } from '~/@types/ActionItem'
import moment from 'moment-timezone'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import CalendarEventsList from '~/components/calendar/CalendarEventsList.vue'
import CalendarEventPreview from '~/components/calendar/CalendarEventPreview.vue'
import CalendarEventMore from '~/components/calendar/CalendarEventMore.vue'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'

export default defineComponent({
  name: 'Calendar',
  components: {
    CalendarEventsList, CalendarEventPreview, CalendarEventMore
  },
  setup (props, { root }) {
    const { $apiCalls, $store, $i18n, $alerts } = root
    const calendar = ref()
    const calType = ref('month')
    const calValue = ref('')
    const currentMonth = ref('')
    const activeEvent = reactive({
      selectedEvent: {} as CalendarEvent,
      selectedElement: null,
      left: false,
      bottom: false
    })
    const moreEvents: Ref<{ events: CalendarEvent[], selectedElement: null | HTMLElement }> = ref({
      events: [],
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
          click: viewCategories,
          if: $store.getters['auth/isAdmin']
        }
      ].filter((action) => action.hasOwnProperty('if') ? action.if : true)
    })

    const categories: Ref<CalendarCategory[]> = ref([])
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
    }

    function next () {
      calendar.value.next()

      nextTick(() => {
        fetchData()
      })
    }

    function prev () {
      calendar.value.prev()

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

    function showEvent (data: any) {
      const { nativeEvent, event } = data

      nextTick(() => {
        activeEvent.selectedEvent = event
        activeEvent.selectedElement = nativeEvent.target
        activeEvent.left = data.left
      })
    }

    function showMoreEvents (ev: any, nativeEvent: any) {
      calType.value = 'day'
      calValue.value = ev.date
      /*const { date } = ev
      moreEvents.value.selectedElement = nativeEvent.target as HTMLElement

      moreEvents.value.events = events.value.filter(e => {
        const start = moment(e.start)
        const end = moment(e.end)

        return start.isSame(date, 'day') || end.isSame(date, 'day')
      })
      console.log(events)*/
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
      $alerts.toastSuccess('calendarEvents.create-event-success')
      fetchData()
    }

    function onEventUpdated (event: CalendarEvent) {
      $alerts.toastSuccess('calendarEvents.update-event-success')
      fetchData()
    }

    function onEventDeleted (event: CalendarEvent) {
      fetchData()
    }

    function onPreviewClose () {
      // activeEvent.selectedEvent = {}
      // activeEvent.selectedElement = null
    }

    async function fetchData () {
      const start = moment(calendar.value.lastStart.date).startOf('month').format('YYYY-MM-DD')
      const end = moment(calendar.value.lastEnd.date).endOf('month').format('YYYY-MM-DD')

      try {
        events.value = await $apiCalls.calendarEventsApi.all(start, end)

        if (activeEvent.selectedEvent?._id) {
          const foundEvent = events.value.find(e => e._id === activeEvent.selectedEvent._id)

          if (foundEvent) {
            activeEvent.selectedEvent = foundEvent
          }
        }
      } catch (e) {
        $alerts.error(e)
      }
    }

    async function fetchCategories () {
      categories.value = await $apiCalls.calendarCategoriesApi.all()
    }

    watch(() => calType.value, () => {
      fetchData()
    })

    onMounted(async () => {
      calendar.value.checkChange()

      // await fetchCategories()
      await fetchData()
    })

    return {
      events,
      visibleEvents,
      categories,
      calendar,
      calValue,
      actionsList,
      currentMonth,
      activeEvent,
      calType,
      calTitle,
      availableCalTypes,
      moreEvents,
      setToday,
      next,
      prev,
      calendarChange,
      getEventColor,
      onEventCreated,
      onEventUpdated,
      onEventDeleted,
      onPreviewClose,
      showEvent,
      showMoreEvents,
      createEvent
    }
  }
})
</script>

<style scoped>

</style>
