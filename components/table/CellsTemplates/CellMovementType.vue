<template>
  <CardTooltip :title="movementType" v-if="hasNotes">
    <span v-html="notes"></span>
  </CardTooltip>

  <div v-else v-html="movementType"></div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { Movement } from '~/@types/Movement'
import MovementTypes from '~/enums/MovementTypes'
import RequestTypes from '~/enums/RequestTypes'

export default defineComponent({
  name: 'CellMovementType',
  props: {
    item: { type: Object as PropType<Movement>, required: true },
    value: [Number, String]
  },
  setup (props, { root }) {
    const { $i18n } = root

    const hasNotes = computed(() => !!props.item.notes)
    const notes = computed(() => props.item.notes)

    const movementType = computed(() => {
      const reqType = props.item.requestType
      const movementId = MovementTypes.get(props.item.movementType).id
      let text = $i18n.t(`enums.MovementTypes.${movementId}`)
      let movementToAvoid = [
        MovementTypes.CANCEL_INTEREST_COLLECTED,
        MovementTypes.CANCEL_DEPOSIT_COLLECTED,
        MovementTypes.CANCEL_COMMISSION_COLLECTED,
        MovementTypes.CANCEL_DEPOSIT_ADDED,
        MovementTypes.INITIAL_DEPOSIT
      ]

      if (reqType && !movementToAvoid.includes(props.item.movementType)) {
        text = $i18n.t(`enums.RequestTypes.${RequestTypes.getIdName(reqType)}`)
      }

      if(props.item.movementType.toString() === "temp"){
        text += " (in lavorazione)"
      }

      if (props.item.movementType === MovementTypes.DEPOSIT_REPAYMENT && props.item.app === 'club') {
        text += ' Club'
      }

      if (props.item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
        return `<strong>${text}</strong>`
      }

      return text
    })

    return {
      hasNotes,
      movementType,
      notes
    }
  }
})
</script>

<style scoped>

</style>
