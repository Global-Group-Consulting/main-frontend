<template>
  <v-menu offset-y v-model="menuOpened"
          :close-on-content-click="false">
    <!-- Menu activator -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon :color="areActiveFilters ? 'primary' : ''">mdi-calendar-filter</v-icon>
      </v-btn>
    </template>

    <v-card class="d-flex flex-no-wrap justify-space-between">
      <v-date-picker
          ref="picker"
          v-model="formData.dates"
          range
          locale="it"
          first-day-of-week="1"
          :show-adjacent-months="true"
          type="month"
          flat
          :max="new Date().toISOString()"
          style="border-top-right-radius: 0;"
          :title-date-format="titleDateFormat"
      >
        <!-- Card actions -->
        <v-btn color="warning"
               text
               @click="onReset"
        >
          Svuota
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            text
            @click="onCancel"
        >
          Annulla
        </v-btn>
        <v-btn
            text
            color="primary"
            @click="onConfirm"
        >
          OK
        </v-btn>
      </v-date-picker>

      <v-divider vertical></v-divider>

      <!-- Predefined selections section -->
      <div>
        <v-card-title>Scelte rapide</v-card-title>

        <v-card-text>
          <v-list dense>
            <v-list-item v-for="(entry, i) in selectableDates" :key="i"
                         @click="onPredefinedDateClick(entry)">
              {{ entry.text }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api'

interface SelectableDate {
  text: string
  range: string[]
}

interface Filters {
  dates: string[]
}

interface FiltersSchemaEntry {
  key: keyof Filters,
  default: any
  message: (value: any) => string
}

export default defineComponent({
  name: 'DashboardCardFilters',
  props: {
    filters: {
      type: Object as PropType<Filters>,
      default: () => ([])
    }
  },
  setup (props, { root, emit }) {
    const { $moment } = root
    const menuOpened = ref(false)
    const filtersSchema: FiltersSchemaEntry[] = [
      {
        key: 'dates',
        default: () => ([]),
        message: (value: string[]) => 'Periodo: ' + titleDateFormat(value, true)
      }
    ]
    const formData: Ref<Filters> = ref({
      dates: []
    })
    const selectableDates: Ref<SelectableDate[]> = ref([
      {
        range: [$moment().subtract(3, 'month').format('YYYY-MM'), $moment().format('YYYY-MM')],
        text: 'Ultimi 3 mesi'
      }, {
        range: [$moment().subtract(6, 'month').format('YYYY-MM'), $moment().format('YYYY-MM')],
        text: 'Ultimi 6 mesi'
      }, {
        range: [$moment().subtract(9, 'month').format('YYYY-MM'), $moment().format('YYYY-MM')],
        text: 'Ultimi 9 mesi'
      }, {
        range: [$moment().subtract(12, 'month').format('YYYY-MM'), $moment().format('YYYY-MM')],
        text: 'Ultimo anno'
      }, {
        range: [$moment().subtract(24, 'month').format('YYYY-MM'), $moment().format('YYYY-MM')],
        text: 'Ultimi 2 anni'
      }
    ])

    const areActiveFilters = computed(() => {
      const length = Object.keys(props.filters).length > 0

      if (!length) {
        return false
      }

      // Check if each filter is different from default
      return Object.keys(props.filters).some((k) => {
        let key = k as keyof Filters
        let defaultValue: any = filtersSchema.find((f) => f.key === key)?.default()
        let newValue: any = props.filters[key]

        if (defaultValue instanceof Array) {
          defaultValue = defaultValue.join()
        }

        if (newValue instanceof Array) {
          newValue = newValue.join()
        }

        return newValue !== defaultValue
      })
    })

    function titleDateFormat (dates: string[], noHtml = false) {
      const toReturn: string[] = []

      const sortedDates = [...dates].sort((a, b) => a > b ? 1 : -1)

      sortedDates.forEach(date => {
        toReturn.push($moment(date).format('MMM \'YY'))
      })

      if (sortedDates.length === 1) {
        toReturn.push('ad oggi')
      }

      if (noHtml) {
        return toReturn.join(' - ')
      }

      return `<small>${toReturn.join(' - ')}</small>`
    }

    function onPredefinedDateClick (entry: SelectableDate) {
      formData.value.dates = entry.range
    }

    function mergeFilters (reset?: boolean) {
      filtersSchema.forEach((field) => {
        const propsValue = props.filters[field.key]
        let newValue = propsValue ?? field.default()

        if (reset) {
          newValue = field.default()
        }

        formData.value[field.key] = newValue
      })
    }

    function emitFilters () {
      // first emit the filters so that props.filters gets updated
      emit('update:filters', formData.value)

      // wait for the update to happen
      root.$nextTick(() => {
        const messages: any[] = []

        if (areActiveFilters.value) {
          filtersSchema.forEach((field) => {
            if (formData.value[field.key]) {
              messages.push(field.message(formData.value[field.key]))
            }
          })
        }

        // emit messages for the filters
        emit('update:filterMessages', messages)
      })
    }

    function onCancel () {
      menuOpened.value = false
    }

    function onConfirm () {
      emitFilters()

      menuOpened.value = false
    }

    function onReset () {
      mergeFilters(true)

      onConfirm()
    }

    watch(() => menuOpened.value, (newVal) => {
      if (!newVal) {
        mergeFilters()
      }
    }, { deep: true })

    watch(() => props.filters, (newVal) => {
      mergeFilters()
    }, { deep: true })

    return {
      menuOpened,
      formData,
      selectableDates,
      areActiveFilters,
      titleDateFormat,
      onPredefinedDateClick,
      onCancel,
      onConfirm,
      onReset
    }
  }
})
</script>

<style scoped>

</style>
