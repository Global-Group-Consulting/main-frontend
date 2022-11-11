<template>
  <div>
    <v-menu
      ref="menu"
      v-model="opened"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      :disabled="readonly"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="dateValue"
          :label="label"
          :prepend-icon="
            typeof $attrs['prepend-icon'] === 'string'
              ? $attrs['prepend-icon']
              : 'mdi-calendar'
          "
          readonly
          v-on="on"
          v-bind="$attrs"
          :clearable="clearable"
          :disabled="disabled"
          :class="{ 'edit-mode': editMode }"
          @click:clear="onClear"
        >
          <template v-slot:prepend>
            <slot name="prepend"></slot>
          </template>

          <template v-slot:label>
            <slot name="label"></slot>
          </template>
        </v-text-field>
      </template>

      <v-card class="d-flex flex-no-wrap justify-space-between">
        <v-date-picker
          ref="picker"
          v-model="dates"
          @input="onInput"
          :readonly="readonly"
          :disabled="disabled"
          :range="range"
          locale="it"
          first-day-of-week="1"
          :show-adjacent-months="true"
          flat
          style="border-top-right-radius: 0;"
          :title-date-format="titleDateFormat"
        >
        </v-date-picker>

        <v-divider vertical></v-divider>

        <div v-if="selectableDates && selectableDates.length > 0">
          <v-card-title>Mese di riferimento</v-card-title>

          <v-card-text>
            <v-list dense>
              <v-list-item v-for="(datesArray, i) in selectableDates"
                           :key="i"
                           @click="onPredefinedDateClick(datesArray)">
                {{ $moment(datesArray[0]).format("MMMM YYYY") }}
              </v-list-item>
            </v-list>
          </v-card-text>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import {dateFormatter, datePickerFormatter} from "~/plugins/filters";

export default {
  name: "DatePickerRange",
  data() {
    return {
      opened: false,
      dates: []
    };
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    label: "",
    initialDate: "",
    min: "",
    max: "",
    range: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    editMode: Boolean,
    selectableDates: Array
  },
  computed: {
    clearable() {
      return this.$attrs.clearable ?? (!this.readonly && !this.disabled)
    },
    dateValue() {
      if (!this.dates || !this.dates.length) {
        return
      }

      return this.dates
        .map(date => dateFormatter(date))
        .join(" - ");
    }
  },
  methods: {
    onInput(value) {
      /* if (this.opened) {
         this.opened = false;
       }*/

      const sorted = value.sort()

      this.$emit("change", sorted);
    },
    onClear() {
      this.dates = [];
      this.$emit("change", this.dates);
    },
    onPredefinedDateClick(datesArray) {
      this.dates = datesArray;

      this.onInput(datesArray)
      this.$refs.picker.tableDate = this.$moment(datesArray[0]).format("YYYY-MM")
    },
    titleDateFormat(dates) {
      const toReturn = []

      dates.forEach(date => {
        toReturn.push(this.$moment(date).format("DD MMM YY"))
      })

      return `<small>${toReturn.join(" - ")}</small>`
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (value) {
        this.dates = value
      }
    }
  }
};
</script>

<style scoped></style>
