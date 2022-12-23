<template>
  <v-menu offset-y v-if="crudActions.length > 0">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" icon v-on="on" :loading="downloadLoading">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <template v-for="entry in crudActions">
        <v-divider v-if="entry.divider" :key="'divider_' + entry.value"></v-divider>

        <v-list-item :key="entry.value" :entry="entry" @click="entry.action">
          <v-list-item-title>
            {{ $t('menus.' + entry.value) }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType, ref } from '@vue/composition-api'
import { IMovement, Movement } from '~/@types/Movement'
import MovementTypes from '~/enums/MovementTypes'
import jsFileDownload from 'js-file-download'

interface CrudAction {
  value: string
  if?: boolean
  divider?: string

  action (entry: IMovement): void
}

export default defineComponent({
  name: 'CellMovementActions',
  props: {
    item: { type: Object as PropType<Movement>, required: true }
  },
  setup (props, { root }) {
    const downloadLoading = ref(false)
    const authUserType: ComputedRef<'user' | 'admin'> = computed(() => root.$store.getters['user/userType'])

    const crudActions: ComputedRef<CrudAction[]> = computed(() => {
      return [
        {
          value: 'downloadReceipt',
          action: () => downloadReceipt(props.item.id, props.item),
          if: authUserType.value === 'user' && props.item.movementType === MovementTypes.DEPOSIT_ADDED
        }
      ].filter(el => 'if' in el ? el.if : true)
    })

    async function downloadReceipt (movementId: string, movement: Movement) {
      let toReturn = false

      downloadLoading.value = true

      try {
        const result = await root.$apiCalls.requests.downloadRequestReceipt(movementId, 'movement')

        jsFileDownload(result.data, result.headers['x-file-name'])

        toReturn = true
      } catch (er) {
        root.$alerts.error(er)
      }

      downloadLoading.value = false

      return toReturn
    }

    return {
      downloadLoading,
      crudActions
    }
  }
})
</script>

<style scoped>

</style>
