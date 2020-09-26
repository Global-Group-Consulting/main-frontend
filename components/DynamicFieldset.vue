<template>
  <div class="dynamic-fieldset">
    <div v-for="(row, index) in schema"
         :key="index"
         v-if="row.hasOwnProperty('if') ? row.if : true">

      <h3 class="primary--text mt-5"
          v-if="row.legend">
        {{ $t('forms.' + row.legend) }}
      </h3>

      <v-row>
        <v-col v-bind="getColumns(row)"
               v-for="(field, key) in row.cols"
               v-if="field.hasOwnProperty('if') ? field.if : true"
               :key="key">
          <component :is="field.component || 'v-text-field'"
                     :label="getLabel(key)"
                     v-bind="field"
                     :items="translateItems(field)"
                     :value="getValue(field, key)"
                     @change="update(key, $event)"
                     :error-messages="errorMessages[key]"
                     :class="{'edit-mode': editMode}"
                     :edit-mode="editMode"
          >
            <template v-slot:prepend v-if="editMode">
              <v-checkbox></v-checkbox>
            </template>

          </component>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { VTextField, VTextarea, VSelect, VFileInput } from 'vuetify/lib'
import DatePicker from '@/components/forms/inputs/DatePicker'
import MoneyInput from '@/components/forms/inputs/MoneyInput'
import ContractSign from '@/components/hompage/activationWizard/ContractSign'

import { validationRules, errorMessages } from '@/mixins/ValidationsParser'
import { validationMixin } from 'vuelidate'
import {
  kebabCase as _kebabCase,
  get as _get
} from 'lodash'

export default {
  name: 'DynamicFieldset',
  components: {
    VTextField, VSelect, DatePicker, VFileInput, ContractSign, VTextarea,
    MoneyInput
  },
  mixins: [validationMixin],
  validations () {
    return {
      form: validationRules(this.schema)
    }
  },
  props: {
    schema: {
      type: Array | Object,
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    },
    fillRow: Boolean,
    editMode: Boolean
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
      if (Object.keys(row.cols).length === 1 && this.fillRow) {
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
        value = this.$options.filters[field.formatter](value, field.formatterParams)
      }

      return value
    },
    getLabel (key) {
      return this.$t('forms.' + _kebabCase(key))
    },
    translateItems (field) {
      if (!field.items) {
        return
      }

      if (typeof field.items === 'string') {
        return _get(this.$store.getters, field.items.replace(/\./g, '/'))
      }

      if (field.items instanceof Array) {
        return field.items
      }

      const enumInstance = field.items
      const enumName = enumInstance.enumName

      return enumInstance.list.map(item => {
        item.id = item.text
        item.text = this.$t(`enums.${enumName}.${item.id}`)

        return item
      })
    },
    update (key, value) {
      const mustValidate = !!this.$v.form[key]

      // stores the new value
      this.form[key] = value

      // trigger touch only if must be validated
      mustValidate && this.$v.form[key].$touch()

      this.$emit('input', {
        ...this.value,
        [key]: value
      })

      // announce validation statu only if must be validated
      mustValidate && this.announceStatus()
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

<style scoped lang="scss">
.dynamic-fieldset::v-deep {
  .edit-mode {
    .v-input__prepend-outer {

      .v-input--checkbox {
        margin-top: 0;
        padding-top: 0;
      }
    }
  }
}
</style>
