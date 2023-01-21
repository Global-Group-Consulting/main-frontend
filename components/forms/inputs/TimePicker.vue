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
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          v-model="time"
          label="Picker in menu"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          v-on="on"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class TimePicker extends Vue {
  @Prop({ type: String })
  value!: string

  menuOpen: boolean = false
  time: string = ''

  onChange (time) {
    this.$refs.menu.save(time)
    this.$emit('change', time)
  }

  @Watch('value', { immediate: true })
  onValueChange (value: string) {
    this.time = value

    // this.$emit('input', value)
  }

}
</script>

<style scoped>

</style>
