<template>
  <v-text-field
    v-bind="$attrs"
    :value="formattedValue"
    :prefix="prefix"
    @input="onInput"
    @change="onChange"
    @focus="onFocus"
    @blur="onBlur"
    ref="textInput"
  >
    <template v-slot:label>
      <slot name="label"></slot>
    </template>
    <template v-slot:prepend>
      <slot name="prepend"></slot>
    </template>

    <template v-slot:append-outer v-if="suffix || (showMax && !$attrs.disabled && !$attrs.readonly)">
      <em v-html="suffix" class="v-text-field__suffix mt-1"></em>

      <span class="mx-1" v-if="suffix && showMax && !$attrs.disabled && !$attrs.readonly"></span>

      <v-btn
        text
        v-if="showMax && !$attrs.disabled && !$attrs.readonly"
        small
        outlined
        color="primary"
        @click="onMaxClick"
      >
        MAX
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
import CurrencyType from "~/enums/CurrencyType";

export default {
  name: "MoneyInput",
  data() {
    return {
      numericValue: 0,
      hasFocus: false,
    };
  },
  props: {
    value: Number | String,
    currency: {
      type: Number,
      default: 1,
    },
    showBrite: {
      type: Boolean,
      default: true
    },
    onlyBrite: {
      type: Boolean,
      default: false
    },
    showMax: Boolean,
    maxValue: Number,
  },
  computed: {
    prefix() {
      return this.$enums.CurrencyType.get(this.activeCurrency)?.symbol;
    },
    suffix() {
      if (!this.showBrite || this.value === null) {
        return ""
      }

      const value =
        this.activeCurrency === 1 ? this.briteValue : this.numericValue;
      const prefixCurrency = this.activeCurrency === 1 ? 2 : 1;
      const currency = this.$enums.CurrencyType.get(prefixCurrency)?.symbol;
      const formatted = this.$options.filters.moneyFormatter(
        this.onlyBrite ? (value / 2) : value,
        prefixCurrency === 2
      );

      if (!formatted) {
        return "";
      }

      return `(${currency} ${formatted})`;
    },
    activeCurrency() {
      if (this.onlyBrite) {
        return this.currency
      }

      return this.hasFocus ? 1 : this.currency;
    },
    briteValue() {
      if (this.onlyBrite) {
        return this.numericValue
      }

      return this.numericValue * 2;
    },
    formattedValue() {
      const value =
        this.activeCurrency === 1 ? this.numericValue : this.briteValue;

      if (this.value === null) {
        return ""
      }

      const newValue = this.$options.filters.moneyFormatter(
        value,
        this.activeCurrency === 2
      );

      this.$refs.textInput && (this.$refs.textInput.$data.lazyValue = newValue);

      return newValue;
    },
  },
  methods: {
    formatForEmit(value) {
      const formattedValue = this.$options.filters.moneyFormatter(value)

      let toEmit = formattedValue.toString();

      if (toEmit) {
        toEmit = +toEmit.replace(/\./g, "").replace(",", ".");
      }

      return isNaN(toEmit) ? null : toEmit;
    },
    onChange(value) {
      this.$emit("change", this.formatForEmit(value));
    },
    onInput(value) {
      this.$emit("input", this.formatForEmit(value));
    },
    onFocus() {
      this.hasFocus = true;
    },
    onBlur() {
      this.hasFocus = false;
    },
    onMaxClick() {
      const value = this.maxValue;

      this.$emit("input", this.formatForEmit(value));
      this.$emit("change", this.formatForEmit(value));
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.numericValue = +val;
      },
    },
  },
};
</script>

<style scoped>

</style>
