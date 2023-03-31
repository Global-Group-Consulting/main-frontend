<template>
  <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
      max-width="400px"
      offset-overflow
      :left="left"
      :bottom="bottom"
      ref="menuEl"
  >
    <v-card
        color="grey lighten-4"
        min-width="350px"
        flat
    >
      <v-toolbar
          :color="color"
          dense
          dark
      >
        <v-spacer></v-spacer>

        <template v-if="!showAsPreview">
          <v-btn icon @click="onEditClick" v-if="!isReadonly">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="onDeleteClick" v-if="!isReadonly">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-else-if="selectedEvent && selectedEvent.start">
          <v-btn text
                 :to="`/calendar?date=${$moment(selectedEvent.start).format('YYYY-MM-DD')}&_id=${selectedEvent._id}`">
            Apri calendario
            <v-icon class="ms-2">mdi-calendar</v-icon>
          </v-btn>
        </template>

        <v-btn icon @click="selectedOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-title v-html="calendarUtilities.getTitle(selectedEvent)" class="pb-0"></v-card-title>

      <v-card-text class="d-flex flex-column" style="max-height: 70vh">
        <span>{{ subtitle }}</span>

        <v-list-item class="ps-0" dense
                     v-for="(section, i) in sections" :key="'sec_' + i">
          <v-list-item-icon class="me-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs"
                        v-on="on">{{ section.icon }}
                </v-icon>
              </template>

              <span>{{ section.tooltip }}</span>
            </v-tooltip>

          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-wrap" v-html="section.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mt-3"></v-divider>

        <CalendarEventComments :event="selectedEvent"
                               :mustReload="selectedOpen"
                               @comments-read="$emit('comments-read', $event)"
                               @data-loaded="menuEl.updateDimensions()"></CalendarEventComments>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, nextTick, PropType, ref, watch } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import moment from 'moment-timezone'
import * as events from 'events'
import { dateFormatter } from '~/plugins/filters'
import { useCalendarUtilities } from '~/composables/useCalendarUtilities'

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
    },
    left: Boolean,
    bottom: Boolean,
    showAsPreview: Boolean
  },
  events: ['event-deleted'],
  setup (props, { root, emit }) {
    const { $store, $i18n, $alerts, $apiCalls } = root
    const calendarUtilities = useCalendarUtilities()
    const selectedOpen = ref(false)
    const start = computed(() => moment(props.selectedEvent.start))
    const end = computed(() => moment(props.selectedEvent.end))
    const menuEl = ref()

    const sections = computed(() => {
      return [
        {
          icon: 'mdi-map-marker',
          text: props.selectedEvent?.place,
          tooltip: 'Luogo'
        },
        {
          icon: 'mdi-shape',
          text: props.selectedEvent?.category?.name,
          tooltip: 'Categoria'
        },
        {
          icon: 'mdi-text',
          text: props.selectedEvent?.notes,
          tooltip: 'Note'
        },
        {
          icon: 'mdi-badge-account',
          text: props.selectedEvent?.users?.length ? props.selectedEvent.users.map(user => user.firstName + ' ' + user.lastName).join('<br>') : '',
          tooltip: 'Agent' + (props.selectedEvent?.users?.length > 1 ? 'i' : 'e')
        },
        {
          icon: 'mdi-account-multiple-outline',
          text: props.selectedEvent?.client
              ? props.selectedEvent?.client?.firstName + ' ' + props.selectedEvent?.client?.lastName
              : (props.selectedEvent.clientName ?? ''),
          tooltip: 'Cliente'
        }
      ].filter((section) => !!section.text)
    })

    const subtitle: ComputedRef<string> = computed(() => {
      let toReturn = [start.value.format('dddd, D MMMM'), '|', start.value.format('HH:mm'), '-', end.value.format('HH:mm')]

      if (!start.value.isSame(end.value, 'day')) {
        toReturn = [start.value.format('ddd, D MMM HH:mm'), '|', end.value.format('ddd, D MMM HH:mm')]
      }

      return toReturn.join(' ')
    })

    const color = computed(() => {
      return props.selectedEvent.category?.color ?? 'primary'
    })

    /**
     * If the event is not public, only admins can edit it
     */
    const isReadonly = computed(() => {
      // if user is admin, all events are editable
      if ($store.getters['user/userIsAdmin']) {
        return false
      }

      return props.selectedEvent.isPublic || props.selectedEvent.authorId !== $store.getters['user/current']._id
    })

    const changeState = (newState: boolean) => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        selectedOpen.value = newState
      }))
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
      menuEl.value.updateDimensions()

      if (selectedOpen.value) {
        selectedOpen.value = false
        requestAnimationFrame(() => requestAnimationFrame(() => changeState(true)))
      } else {
        changeState(true)
      }
    })

    watch(() => selectedOpen.value, (newVal) => {
      if (!newVal) {
        changeState(false)
      }else{
        emit("opened")
      }
    })

    return {
      menuEl,
      selectedOpen,
      subtitle,
      sections,
      color,
      isReadonly,
      calendarUtilities,
      onEditClick,
      onDeleteClick
    }
  }
})
</script>

<style scoped>

</style>
