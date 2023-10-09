<template>
  <span class="text-no-wrap" :class="color">
     {{ sign }} {{ amount }} €
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import MovementTypes from '~/enums/MovementTypes'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import { Movement } from '~/@types/Movement'

export default defineComponent({
  name: 'CellMovementAmount',
  props: {
    item: { type: Object as PropType<Movement>, required: true },
    value: Number
  },
  setup (props) {
    const sign = computed(() => {
      if (props.item.movementType.toString() === 'temp') {
        return ''
      }

      return MovementTypes.OUT_MOVEMENT_TYPES.includes(props.item.movementType) ? '-' : '+'
    })
    const color = computed(() => {
      if (props.item.movementType.toString() === 'temp') {
        return ''
      }

      return sign.value === '-' ? 'red--text' : 'green--text'
    })
    const amount = computed(() => {
      return moneyFormatter(props.value?.toFixed(2))
    })

    return { sign, color, amount, moneyFormatter }
  }
})
</script>

<style scoped>

</style>
