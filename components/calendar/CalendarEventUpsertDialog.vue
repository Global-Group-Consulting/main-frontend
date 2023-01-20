<template>
  <div>
    <portal to="dialog-content">
      <dynamic-fieldset :schema="formSchema"
                        v-model="formData"
                        immediate-update
      ></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color=""
             text
             @click="close">
        {{ $t(dialogData.texts.cancelBtn) }}
      </v-btn>
      <v-btn color="success"
             @click="onSubmitClick">
        {{ $t(dialogData.texts.confirmBtn) }}
        <v-icon class="ml-2">mdi-send</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import calendarEventUpsertSchema from '~/config/forms/calendarEventUpsertSchema'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import moment from 'moment-timezone'

export default defineComponent({
  name: 'CalendarEventUpsertDialog',
  emits: ['event-created', 'event-updated'],
  setup (props, { root, emit }) {
    const { $store, $apiCalls, $alerts } = root
    const formData = ref({
      name: '',
      place: '',
      categoryId: '',
      clientId: '',
      notes: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    })

    const formSchema = computed(() => calendarEventUpsertSchema(formData))

    const dialogData = computed(() => {
      return $store.getters['dialog/dialogData']
    })

    const incomingData = computed(() => {
      return dialogData.value.data
    })

    function close () {
      $store.dispatch('dialog/updateStatus', false)
    }

    async function onSubmitClick () {
      let action
      if (incomingData.value.event?._id) {
        action = 'update'
      } else {
        action = 'create'
      }

      try {
        const dates = {
          start: {
            original: formData.value.startDate + ' ' + formData.value.startTime,
            formatted: moment(formData.value.startDate + ' ' + formData.value.startTime)
          },
          end: {
            original: formData.value.endDate + ' ' + formData.value.endTime,
            formatted: moment(formData.value.endDate + ' ' + formData.value.endTime)
          }
        }

        const result = await $apiCalls.calendarEventsApi[action]({
          ...formData.value,
          start: dates.start.formatted.toISOString(),
          end: dates.end.formatted.toISOString()
        })

        if (result) {
          $store.dispatch('dialog/updateStatus', false)
          emit('event-' + action + 'd', result)
        }
      } catch (e) {
        $alerts.error(e)
      }
    }

    watch(incomingData, (data: { event: CalendarEvent }) => {
      if (data.hasOwnProperty('event')) {
        const start = moment(data.event.start)
        const end = moment(data.event.end)

        formData.value.name = data.event.name
        formData.value.place = data.event.place
        formData.value.category = data.event.category
        formData.value.clientId = data.event.clientId
        formData.value.notes = data.event.notes
        formData.value.startDate = start.format('YYYY-MM-DD')
        formData.value.startTime = start.format('HH:mm')
        formData.value.endDate = end.format('YYYY-MM-DD')
        formData.value.endTime = end.format('HH:mm')
      }
    }, { immediate: true, deep: true })

    return {
      formSchema,
      formData,
      dialogData,
      incomingData,
      calendarEventUpsertSchema,
      close,
      onSubmitClick
    }
  }
})
</script>

<style scoped>

</style>
