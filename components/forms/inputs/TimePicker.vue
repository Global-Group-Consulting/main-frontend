<template>
  <v-menu
      ref="menu"
      v-model="menuOpen"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          v-model="time"
          label="Picker in menu"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="$attrs"
          v-on="on"
          :disabled="disabled"

      >
        <template v-slot:prepend>
          <slot name="prepend"></slot>
        </template>

        <template v-slot:label>
          <slot name="label"></slot>
        </template>
      </v-text-field>
    </template>

    <v-time-picker
        v-if="menuOpen"
        v-model="time"
        full-width
        format="24hr"
        @change="onChange"
    >
      <v-spacer></v-spacer>
      <v-btn
          text
          color="primary"
          @click="menuOpen = false"
      >
        Annulla
      </v-btn>
      <v-btn
          text
          color="primary"
          @click="onChange(time)"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'TimePicker',
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: Boolean
  },
  setup (props, { emit }) {
    const menu = ref()
    const menuOpen = ref(false)
    const time = ref('')

    const onChange = (time: any) => {
      menu.value.save(time)
      emit('change', time)
    }

    watch(() => props.value, (value: string) => {
      time.value = value
    }, { immediate: true })

    return {
      menu,
      menuOpen,
      time,
      onChange
    }
  }
})
</script>

<style scoped>

</style>
