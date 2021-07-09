<template>
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
    <v-date-picker
      ref="picker"
      v-model="dates"
      @input="onInput"
      :readonly="readonly"
      :disabled="disabled"
      :range="range"
      locale="it"
    >
    </v-date-picker>
  </v-menu>
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

      this.$emit("change", value);
    },
    onClear() {
      this.dates = [];
      this.$emit("change", this.dates);
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
