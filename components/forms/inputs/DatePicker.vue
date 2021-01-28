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
        :value="dateValue | dateFormatter"
        :label="label"
        :prepend-icon="
          typeof $attrs['prepend-icon'] === 'string'
            ? $attrs['prepend-icon']
            : 'mdi-calendar'
        "
        readonly
        v-on="on"
        v-bind="$attrs"
        @change="onInput"
        :clearable="clearable"
        :disabled="disabled"
        :class="{ 'edit-mode': editMode }"
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
      v-model="dateValue"
      @input="onInput"
      :readonly="readonly"
      :disabled="disabled"
      :picker-date="dateValue ? '' : initialDate | datePickerFormatter"
      :min="min | datePickerFormatter"
      :max="max"
      locale="it"
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
import {datePickerFormatter} from "~/plugins/filters";

export default {
  name: "DatePicker",
  data() {
    return {
      opened: false,
      dateValue: datePickerFormatter(this.value)
    };
  },
  props: {
    value: "",
    label: "",
    initialDate: "",
    min: "",
    max: "",
    startByYear: {
      type: Boolean,
      default: true
    },
    readonly: Boolean,
    disabled: Boolean,
    editMode: Boolean,
  },
  computed: {
    clearable() {
      return this.$attrs.clearable ?? (!this.readonly && !this.disabled)
    }
  },
  methods: {
    onInput(value) {
      if (this.opened) {
        this.opened = false;
      }

      this.$emit("change", value);
    }
  },
  watch: {
    value: function (value) {
      const newValue = datePickerFormatter(this.value);

      if (this.dateValue !== newValue) {
        this.dateValue = newValue;
      }
    },
    opened(val) {
      if (this.startByYear) {
        val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
      }
    }
  }
};
</script>

<style scoped></style>
