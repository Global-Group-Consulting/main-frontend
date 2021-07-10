<template>
  <v-edit-dialog
    :return-value.sync="localValue"
    :persistent="false"
    @save="onSave"
  >
    <a class="text-decoration-underline-dotted caption" v-if="!value">
      ...
    </a>
    <span v-else :class="color">{{ value| moneyFormatter(false, true) }}</span>

    <template v-slot:input>
      <div class="mt-4 title">
        {{ $t(`dialogs.calculatorMovementsDialog.title${$options.filters.upperFirst(field)}`) }}
      </div>

      <money-input v-model="localValue" clearable></money-input>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from "vue-property-decorator"
import MoneyInput from "~/components/forms/inputs/MoneyInput.vue";

@Component({
  components: {MoneyInput},
})
export default class CalculatorMovementDialog extends Vue {
  @Prop({type: Object, required: true})
  cellData!: any

  @Prop({type: String, required: true})
  field!: string

  @Prop({type: String})
  color!: string

  @Prop({type: Array, default: () => []})
  selectData!: any[]

  @Prop({type: Boolean, default: false})
  textInput!: boolean

  @Prop({type: [String, Number]})
  value!: any

  @Prop({type: Number})
  maxValue!: number

  public localValue: string | string[] = this.value || 0

  @Watch("localValue")
  onLocalValueChanged() {
    this.$emit("input", this.localValue)
  }

  async onOpen() {
  }

  async onClose() {
  }

  async onSave() {
    this.$emit("saved")
  }
}
</script>

<style scoped>

</style>
