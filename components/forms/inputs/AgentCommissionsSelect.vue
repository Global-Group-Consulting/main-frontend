<template>
  <v-item-group
      multiple
      v-model="selection"
      @change="onChange"
  >
    <v-item v-slot="{ active, toggle }"
            v-for="(item, i) in items" :key="item.name"
            :value="item.name"
    >
      <v-switch @change="toggle"
                :name="item.name"
                :hint="$t('forms.' + item.label + '-details', {percentage: item.value})"
                persistent-hint
                :input-value="selection.includes(item.name)"
                :disabled="disabled">
        <template v-slot:label>
          <v-layout align-content-center>
            <label class="flex-fill d-flex align-center">{{ $t('forms.' + item.label) }}</label>
            <v-text-field dense hide-details
                          v-if="item.input"
                          type="number"
                          v-model="item.value"
                          class="text-right ml-3"
                          append-icon="mdi-percent"
                          :style="`max-width: ${!item.maxValue ? 70 : 140}px`"
                          :disabled="!selection.includes(item.name) || disabled"
                          @click.stop=""
                          @input="onChange">
              <template v-slot:append-outer v-if="item.maxValue">
                <small class="text-no-wrap" style="line-height: 1.4em">
                  (Max {{ item.maxValue }}%)
                </small>
              </template>

            </v-text-field>
          </v-layout>
        </template>
      </v-switch>
    </v-item>
  </v-item-group>
</template>

<script>
import { computed, ref, watch } from '@vue/composition-api'
import AgentTeamType from '~/enums/AgentTeamType'

export default {
  name: 'AgentCommissionsSelect',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    refAgent: Object,
    disabled: Boolean,
    agentTeamType: String
  },
  setup (props, { root, emit }) {
    const selection = ref([])

    const items = computed(() => {
      return [
        {
          name: 'personalClientDeposit',
          label: 'personal-client-deposit',
          input: true,
          defaultValue: 5,
          value: 5,
          if: props.agentTeamType === AgentTeamType.GROUP_PERCENTAGE
        },
        {
          name: 'newDeposit',
          label: 'new-deposit' + (props.agentTeamType === AgentTeamType.GROUP_PERCENTAGE ? '-group' : ''),
          input: true,
          defaultValue: 5,
          value: 5,
          maxValue: getRefAgentPercentage()
        },
        {
          name: 'totalDeposit',
          label: 'total-deposit'
        },
        {
          name: 'annualDeposit',
          label: 'annual-deposit',
          input: true,
          defaultValue: 6,
          value: 6
        }
      ].filter(_item => _item?.if ?? true)
    })

    function getRefAgentPercentage () {
      const rightCommission = props.refAgent?.commissionsAssigned.find(_comm => _comm.name === root.$enums.CommissionType.NEW_DEPOSIT)

      return rightCommission ? rightCommission.percent : 0
    }

    function onChange () {
      emit('change', selection.value.reduce((acc, curr) => {
        const currItem = items.value.find(_item => _item.name === curr)

        // i'm using an array because in the future i could add more info on each element
        acc.push({
          name: curr,
          percent: +currItem.value || null
        })

        return acc
      }, []))
    }

    watch(() => props.value, (newValue) => {
      if (!newValue) {
        return
      }

      for (const item of items.value) {
        const newValueItem = newValue.find(_entry => _entry.name === item.name)

        if (newValueItem && !selection.value.includes(item.name)) {
          newValueItem && selection.value.push(item.name)
        }

        // allow value of 0 as requested on issue #543e5b68ea254d66b062baecbec35e12
        if (!newValueItem || newValueItem.percent < 0) {
          item.value = item.defaultValue
        } else if (+newValueItem.percent !== +item.value) {
          item.value = newValueItem.percent || item.defaultValue
        }
      }
    }, { immediate: true, deep: true })

    return {
      selection,
      items,
      onChange
    }
  }
}
</script>

<style lang="scss">
.text-right .v-text-field__slot {
  input {
    text-align: right;
  }
}
</style>
