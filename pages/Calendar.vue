<template>
  <v-layout>
    <v-flex>
      <PageHeader page-name="calendar"></PageHeader>

      <PageToolbar :actions-list="actionsList"></PageToolbar>

      <v-card flat outlined>
        <v-card-text class="pb-0 d-flex align-center">
          <tooltip-btn text outlined @click="setToday">Oggi</tooltip-btn>
          <tooltip-btn icon icon-name="mdi-chevron-left" @click="prev"></tooltip-btn>
          <tooltip-btn icon icon-name="mdi-chevron-right" @click="next"></tooltip-btn>

          <h2 class="mb-0">{{ calTitle }}</h2>

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
                      @change="fetchEvents"
          ></v-calendar>

        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, ref } from '@vue/composition-api'
import { ActionItem } from '~/@types/ActionItem'
import moment from 'moment-timezone'

export default defineComponent({
  name: 'Calendar',
  setup () {
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

    const availableCalTypes = [
      { text: 'Giorno', value: 'day' },
      { text: 'Settimana', value: 'week' },
      { text: 'Mese', value: 'month' }
    ]

    const calTitle = computed(() => {
      const date = moment(currentMonth.value)
      const toReturn = [date.format('MMMM yy')]

      if (calType.value === 'week') {
        toReturn.push(`(${date.format('DD/MM')} - ${date.add(6, 'days').format('DD/MM')})`)
      } else if (calType.value === 'day') {
        toReturn.push(`(${date.format('dddd DD/MM')})`)
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

    function fetchEvents (e: any) {
      currentMonth.value = e.start.date
      console.log('fetchEvents', e)
    }

    onMounted(() => {
      console.log('calendar mounted')
      calendar.value.checkChange()
    })

    return {
      calendar,
      calValue,
      actionsList,
      currentMonth,
      setToday,
      next,
      prev,
      fetchEvents,
      calType,
      calTitle,
      availableCalTypes
    }
  }
})
</script>

<style scoped>

</style>
