<template>
  <v-text-field v-bind="$attrs"
                :value="formattedValue"
                :prefix="prefix"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
  >
    <template v-slot:append-outer>
      <em v-html="suffix"
          class="v-text-field__suffix mt-1"></em>

      <span class="mx-1" v-if="suffix && showMax"></span>

      <v-btn text v-if="showMax" small outlined
             color="primary"
             @click="onMaxClick">
        MAX
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'MoneyInput',
  data () {
    return {
      numericValue: 0,
      hasFocus: false,
    }
  },
  props: {
    value: Number | String,
    currency: Number,
    showMax: Boolean,
    maxValue: Number
  },
  computed: {
    prefix () {
      return this.$enums.CurrencyType.get(this.activeCurrency)?.symbol
    },
    suffix () {
      const value = this.activeCurrency === 1 ? this.briteValue : this.numericValue
      const prefixCurrency = this.activeCurrency === 1 ? 2 : 1
      const currency = this.$enums.CurrencyType.get(prefixCurrency)?.symbol
      const formatted = this.$options.filters.moneyFormatter(value, prefixCurrency === 2)

      if (!formatted) {
        return ''
      }

      return `(${currency} ${formatted})`
    },
    activeCurrency () {
      return this.hasFocus ? 1 : this.currency
    },
    briteValue () {
      return this.numericValue * 2
    },
    formattedValue () {
      const value = this.activeCurrency === 1 ? this.numericValue : this.briteValue

      return this.$options.filters.moneyFormatter(value, this.activeCurrency === 2)
    }
  },
  methods: {
    formatForEmit (value) {
      let toEmit = value.toString()

      if (toEmit) {
        toEmit = toEmit.replace(/\./g, '').replace(',', '.')
      }

      return +toEmit
    },
    onChange (value) {
      this.$emit('change', this.formatForEmit(value))
    },
    onInput (value) {
      this.$emit('input', this.formatForEmit(value))
    },
    onFocus () {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
    },
    onMaxClick () {
      const value = this.maxValue

      this.$emit('input', this.formatForEmit(value))
      this.$emit('change', this.formatForEmit(value))
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.numericValue = +val
      }
    },
  }
}
</script>

<style scoped>

</style>
