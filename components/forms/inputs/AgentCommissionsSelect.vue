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
                :hint="$t('forms.' + item.label + '-details')"
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
                          style="max-width: 70px"
                          :disabled="!selection.includes(item.name) || disabled"
                          @click.stop=""
                          @input="onChange">

            </v-text-field>
          </v-layout>
        </template>
      </v-switch>
    </v-item>
  </v-item-group>
</template>

<script>
import {ref, watch} from "@vue/composition-api";

export default {
  name: "AgentCommissionsSelect",
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    disabled: Boolean
  },
  setup(props, {root, emit}) {
    const selection = ref([])
    const items = ref([{
      name: "newDeposit",
      label: "new-deposit",
      input: true,
      defaultValue: 4,
      value: 4
    },
      {
        name: "totalDeposit",
        label: "total-deposit",
      },
      {
        name: "annualDeposit",
        label: "annual-deposit",
        input: true,
        defaultValue: 6,
        value: 6
      }])

    function onChange() {
      emit("change", selection.value.reduce((acc, curr) => {
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

        if (!newValueItem || newValueItem.value === item.value) {
          continue
        }

        item.value = newValueItem.value || item.defaultValue
      }
    }, {immediate: true, deep: true})

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
