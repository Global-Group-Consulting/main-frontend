<template>
  <v-menu
    ref="menu"
    v-model="menuOpened"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    :disabled="readonly"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        ref="textField"
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
        @click:clear="onClear"
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
      :picker-date="pickerDate"
      :min="minDate"
      :max="max"
      locale="it"
    >
    </v-date-picker>
  </v-menu>
</template>


<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {datePickerFormatter} from "~/plugins/filters";

@Component
export default class DatePicker extends Vue {
  @Prop({type: String})
  value!: string
  @Prop({type: String})
  label!: string
  @Prop({type: String})
  initialDate!: string
  @Prop({type: String})
  min!: string
  @Prop({type: String})
  max!: string
  @Prop({type: Boolean, default: true})
  startByYear!: boolean
  @Prop({type: Boolean})
  readonly!: boolean
  @Prop({type: Boolean})
  disabled!: boolean
  @Prop({type: Boolean})
  editMode!: boolean
  @Prop({type: String, default: "date"})
  type!: string

  $refs!: {
    picker: any,
    textField: HTMLInputElement
  }

  menuOpened: boolean = false
  dateValue: string = this.value ? datePickerFormatter(this.value) : null

  get clearable() {
    return this.$attrs.clearable ?? (!this.readonly && !this.disabled)
  }

  get pickerDate() {
    return this.dateValue ? '' : datePickerFormatter(this.initialDate)
  }

  get minDate() {
    return datePickerFormatter(this.min)
  }

  onInput(value: string) {
    if (this.menuOpened) {
      this.menuOpened = false;
    }

    if (this.dateValue !== value) {
      this.dateValue = value
    }

    this.$emit("change", value);
  }

  onClear(ev: any) {
    this.dateValue = null

    setTimeout(() => {
      this.$refs.textField.blur();
    })

    this.$emit("change", null);
  }

  @Watch("value")
  onValueChange(value: string) {
    const newValue = datePickerFormatter(value);

    if (this.dateValue !== newValue) {
      this.dateValue = newValue;
    }
  }

  @Watch("menuOpened")
  onOpenedChange(val: string) {
    if (this.startByYear) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  }
}
</script>
