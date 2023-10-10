<template>
  <v-edit-dialog
      :return-value.sync="localValue"
      persistent
      large
      cancel-text="Annulla"
      save-text="Salva"
      @save="onSave"
  >
    <a class="text-decoration-underline-dotted caption" v-if="!value">...</a>
    <a v-else :class="color" class="text-decoration-underline-dotted">€ {{ value| moneyFormatter(false, true) }}</a>

    <template v-slot:input>
      <div class="mt-4 title">
        {{ $t(`dialogs.inlineMovementDialog.title${$options.filters.upperFirst(field)}`) }}
      </div>

      <money-input v-model="localValue"></money-input>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import MoneyInput from '~/components/forms/inputs/MoneyInput.vue'

@Component({
  components: { MoneyInput }
})
export default class CalculatorMovementDialog extends Vue {
  @Prop({ type: Object, required: true })
  cellData!: any

  @Prop({ type: String, required: true })
  field!: string

  @Prop({ type: String })
  color!: string

  @Prop({ type: Array, default: () => [] })
  selectData!: any[]

  @Prop({ type: Boolean, default: false })
  textInput!: boolean

  @Prop({ type: [String, Number] })
  value!: any

  @Prop({ type: Number })
  maxValue!: number

  public localValue: string | string[] = this.value || 0

  @Watch('value')
  onValueChange(){
    this.localValue = this.value
  }

  async onOpen () {
  }

  async onClose () {
  }

  async onSave () {
    const movementId = this.cellData.id
    const field = this.field
    const value = this.localValue

    try {
      await this.$apiCalls.movementApi.update(movementId, field, +value)

      this.$emit('saved')
    } catch (e) {
      this.$alerts.error(e)
    }
  }
}
</script>

<style scoped>

</style>
