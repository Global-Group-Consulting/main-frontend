<template>
  <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
  >
    <v-card
        color="grey lighten-4"
        min-width="350px"
        flat
    >
      <v-toolbar
          :color="selectedEvent.color"
          dense
          dark
      >
        <v-spacer></v-spacer>

        <v-btn icon @click="onEditClick">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="onDeleteClick">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon @click="selectedOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-title v-html="selectedEvent.name" class="pb-0"></v-card-title>

      <v-card-text>
        <span>{{ subtitle }}</span>

        <v-list-item class="ps-0" dense
                     v-for="(section, i) in sections" :key="'sec_' + i">
          <v-list-item-icon class="me-2">
            <v-icon>{{ section.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-html="section.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <span v-html="selectedEvent.notes"></span>
      </v-card-text>

      <!--      <v-card-actions>
              <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>-->
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, PropType, ref, watch } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import moment from 'moment-timezone'
import * as events from 'events'

export default defineComponent({
  name: 'CalendarEventPreview',
  props: {
    selectedEvent: {
      type: Object as PropType<CalendarEvent>,
      default: () => ({}),
      required: true
    },
    selectedElement: {
      type: HTMLElement as PropType<HTMLElement>,
      default: null
    }
  },
  events: ['event-deleted'],
  setup (props, { root, emit }) {
    const { $store, $i18n, $alerts, $apiCalls } = root
    const selectedOpen = ref(false)
    const start = computed(() => moment(props.selectedEvent.start))
    const end = computed(() => moment(props.selectedEvent.end))

    const sections = computed(() => {
      return [
        {
          icon: 'mdi-map-marker',
          text: props.selectedEvent?.place
        },
        {
          icon: 'mdi-shape',
          text: props.selectedEvent?.category
        },
        {
          icon: 'mdi-text',
          text: props.selectedEvent?.notes
        },
        {
          icon: 'mdi-badge-account',
          text: props.selectedEvent?.userId?._id
        },
        {
          icon: 'mdi-account-multiple-outline',
          text: props.selectedEvent?.clientId?._id
        }
      ].filter((section) => !!section.text)
    })

    const subtitle = computed(() => {
      return start.value.format('dddd, D MMMM') + ' | ' + start.value.format('HH:mm') + ' - ' + end.value.format('HH:mm')
    })

    const changeState = (newState: boolean) => {
      requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = newState))
    }

    function onEditClick () {
      $store.dispatch('dialog/updateStatus', {
        id: 'CalendarEventUpsertDialog',
        title: $i18n.t('dialogs.calendarEventDialog.title-update') as string,
        texts: {
          cancelBtn: 'dialogs.calendarEventDialog.btn-cancel',
          confirmBtn: 'dialogs.calendarEventDialog.btn-update'
        },
        data: {
          event: props.selectedEvent
        }
      })

      changeState(false)
    }

    function onDeleteClick () {
      $alerts.askBeforeAction({
        key: 'calendarEvents.delete-event',
        data: { title: props.selectedEvent.name },
        preConfirm: async () => {
          try {
            await $apiCalls.calendarEventsApi.delete(props.selectedEvent._id)

            changeState(false)

            nextTick(() => emit('event-deleted', props.selectedEvent))
          } catch (e) {
            $alerts.error(e)
          }
        }
      })
    }

    watch(() => props.selectedElement, () => {

      if (selectedOpen.value) {
        selectedOpen.value = false
        requestAnimationFrame(() => requestAnimationFrame(() => changeState(true)))
      } else {
        changeState(true)
      }
    })

    return {
      selectedOpen,
      subtitle,
      sections,
      onEditClick,
      onDeleteClick
    }
  }
})
</script>

<style scoped>

</style>
