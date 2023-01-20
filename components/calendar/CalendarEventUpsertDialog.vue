<template>
  <div>
    <portal to="dialog-content">
      <dynamic-fieldset :schema="formSchema"
                        v-model="formData"
                        immediate-update
                        ref="form"
      ></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color=""
             text
             @click="close">
        {{ $t(dialogData.texts.cancelBtn) }}
      </v-btn>
      <v-btn color="success"
             elevation="0"
             @click="onSubmitClick">
        {{ $t(dialogData.texts.confirmBtn) }}
      </v-btn>
    </portal>
  </div>
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
import calendarEventUpsertSchema from '~/config/forms/calendarEventUpsertSchema'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import moment from 'moment-timezone'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'

export default defineComponent({
  name: 'CalendarEventUpsertDialog',
  emits: ['event-created', 'event-updated'],
  setup (props, { root, emit }) {
    const { $store, $apiCalls, $alerts } = root
    const form = ref()
    const formData = ref({
      name: '',
      place: '',
      categoryId: '',
      clientId: '',
      client: {},
      userId: '',
      user: {},
      notes: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    })
    const categories: Ref<CalendarCategory[]> = ref([])

    const categoriesOptions = computed(() => {
      return categories.value.map((category) => {
        return {
          value: category._id,
          text: category.name,
          color: category.color
        }
      })
    })
    const formSchema = computed(() => calendarEventUpsertSchema(formData.value, categoriesOptions.value, $apiCalls))

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

      if (!(await form.value.validate())) {
        return
      }

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
        }, incomingData.value.event?._id)

        if (result) {
          $store.dispatch('dialog/updateStatus', false)
          emit('event-' + action + 'd', result)
        }
      } catch (e) {
        $alerts.error(e)
      }
    }

    async function fetchCategories () {
      try {
        categories.value = await $apiCalls.calendarCategoriesApi.all()
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
        formData.value.categoryId = data.event.categoryId
        formData.value.clientId = data.event.clientId
        formData.value.client = data.event.client
        formData.value.userId = data.event.userId
        formData.value.user = data.event.user
        formData.value.notes = data.event.notes
        formData.value.startDate = start.format('YYYY-MM-DD')
        formData.value.startTime = start.format('HH:mm')
        formData.value.endDate = end.format('YYYY-MM-DD')
        formData.value.endTime = end.format('HH:mm')
      }
    }, { immediate: true, deep: true })

    watch(() => formData.value, (newValue) => {
      if (formData.value.endDate < formData.value.startDate) {
        requestAnimationFrame(() => {
          formData.value.endDate = formData.value.startDate
        })
      }

      if (formData.value.endTime < formData.value.startTime && formData.value.endDate === formData.value.startDate) {
        requestAnimationFrame(() => {
          formData.value.endTime = formData.value.startTime
        })
      }
    }, { deep: true })

    onMounted(async () => {
      await fetchCategories()
    })

    return {
      formSchema,
      formData,
      dialogData,
      incomingData,
      form,
      calendarEventUpsertSchema,
      close,
      onSubmitClick
    }
  }
})
</script>

<style scoped>

</style>
