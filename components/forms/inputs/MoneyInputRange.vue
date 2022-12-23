<template>
  <div class="d-flex align-center">
    <money-input :show-brite="false"
                 :label="minLabel ? $t(`forms.${minLabel}`) : ''"
                 :value="minValue"
                 v-bind="$attrs"
                 @input="onInput('minValue', $event)"
                 @change="onChange"
                 @keyup="$emit('keyup', $event)"/>

    <span class="mx-3"> - </span>

    <money-input :show-brite="false"
                 :label="maxLabel ? $t(`forms.${maxLabel}`) : ''"
                 :value="maxValue"
                 v-bind="$attrs"
                 @input="onInput('maxValue', $event)"
                 @change="onChange"
                 @keyup="$emit('keyup', $event)"/>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import MoneyInput from "~/components/forms/inputs/MoneyInput.vue";
import {RangeValue} from "~/@types/components/form/MoneyInputRange";


@Component({
  components: {MoneyInput}
})
export default class MoneyInputRange extends Vue {
  @Prop({type: Object})
  public value!: RangeValue

  @Prop({type: String})
  public minLabel!: string;

  @Prop({type: String})
  public maxLabel!: string;

  minValue: number | null = null;
  maxValue: number | null = null;

  onInput(valueKey: "maxValue" | "minValue", newValue: number) {
    this[valueKey] = newValue;
  }

  onChange() {
    this.$emit("input", {
      min: this.minValue,
      max: this.maxValue
    })
  }

  @Watch("value")
  onValueChange(value: RangeValue | null) {
    if (!value) {
      value = {
        max: null,
        min: null
      }
    }

    this.minValue = value.min;
    this.maxValue = value.max;
  }

}
</script>

<style scoped>

</style>
