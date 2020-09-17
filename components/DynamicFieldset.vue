<template>
  <div>
    <div v-for="(row, index) in schema"
         :key="index"
         v-if="row.hasOwnProperty('if') ? row.if : true">

      <h3 class="primary--text mt-5"
          v-if="row.legend">
        {{ $t('usersForm.' + row.legend) }}
      </h3>

      <v-row>
        <v-col v-bind="getColumns(row)"
               v-for="(field, key) in row.cols"
               v-if="field.hasOwnProperty('if') ? field.if : true"
               :key="key">
          <component :is="field.component || 'v-text-field'"
                     :label="$t('forms.' + key)"
                     v-bind="field"
                     :value="getValue(field, key)"
                     @input="update(key, $event)"
                     :error-messages="errorMessages[key]"
          ></component>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { VTextField, VSelect } from 'vuetify/lib'
import DatePicker from '@/components/forms/inputs/DatePicker'

import { validationRules, errorMessages } from '@/mixins/ValidationsParser'
import { validationMixin } from 'vuelidate'

export default {
  name: 'DynamicFieldset',
  components: {
    VTextField, VSelect, DatePicker
  },
  mixins: [validationMixin],
  validations () {
    return {
      form: validationRules(this.schema)
    }
  },
  props: {
    schema: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: {}
    }
  },
  computed: {
    errorMessages,
  },
  methods: {
    getColumns (row) {
      if (Object.keys(row.cols).length === 1) {
        return
      }

      return {
        cols: '12',
        sm: '6',
        lg: '4'
      }
    },
    getValue (field, key) {
      let value = this.value[key]

      if (field.formatter) {
        value = this.$options.filters[field.formatter](value)
      }

      return value
    },
    update (key, value) {
      this.form[key] = value
      this.$v.form[key].$touch()

      this.$emit('input', {
        ...this.value,
        [key]: value
      })
      this.announceStatus()
    },
    announceStatus () {
      this.$emit('status', {
        invalid: this.$v.$invalid
      })
    },
    validate () {
      this.$v.$touch()
      this.announceStatus()
    }
  },
  created () {
    for (let { cols } of this.schema) {
      for (let name in cols) {
        this.$set(this.form, name, this.value[name])
      }
    }
  }
}
</script>

<style scoped>

</style>
