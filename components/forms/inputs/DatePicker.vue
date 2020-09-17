<template>
  <v-menu
          v-model="opened"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
              :value="dateValue | dateFormatter"
              :label="label"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
              @change="onInput"
              clearable
      ></v-text-field>
    </template>
    <v-date-picker v-model="dateValue"
                   @input="onInput"
                   v-bind:picker-date="(dateValue ? '' : initialDate)|datePickerFormatter"
                   v-bind:min="min|datePickerFormatter"
                   locale="it"></v-date-picker>

  </v-menu>
</template>

<script>
  import {datePickerFormatter} from '~/plugins/filters'

  export default {
    name:     'DatePicker',
    data () {
      return {
        opened:    false,
        dateValue: datePickerFormatter(this.value)
      }
    },
    props:    {
      value:       '',
      label:       '',
      initialDate: '',
      min: ''
    },
    computed: {},
    methods:  {
      onInput (value) {
        if (this.opened) {
          this.opened = false
        }

        this.$emit('input', value)
      }
    },
    watch:    {
      value: function (value) {
        this.dateValue =datePickerFormatter(this.value)
      }
    }
  }
</script>

<style scoped>

</style>