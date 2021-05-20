<template>
  <v-text-field
    v-bind="$attrs"
    v-model="inputValue"
    :prefix="prefix"
    :auto-decimal-mode="false"
    v-currency="directiveOptions"
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

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {moneyFormatter} from "~/plugins/filters";
import {setValue, getValue} from "vue-currency-input";

@Component({})
export default class MoneyInput extends Vue {
  @Prop({type: Number})
  value!: number
  @Prop({type: Number, default: 1})
  currency!: number

  @Prop({type: Boolean, default: true})
  showBrite!: boolean

  @Prop({type: Boolean, default: false})
  onlyBrite!: boolean

  @Prop({type: Boolean})
  showMax!: boolean

  @Prop({type: Number})
  maxValue!: number

  $refs!: {
    textInput: any
  }

  public inputValue = null

  public numericValue: number = 0
  public hasFocus: boolean = false

  public directiveOptions: any = {
    autoDecimalMode: false,
    distractionFree: false,
    currency: false
  }

  get prefix() {
    return this.$enums.CurrencyType.get(this.activeCurrency)?.symbol;
  }

  get suffix() {
    if (!this.showBrite || this.value === null) {
      return ""
    }

    const value: number = this.activeCurrency === 1 ? this.briteValue : this.numericValue;
    const prefixCurrency = this.activeCurrency === 1 ? 2 : 1;
    const currency = this.$enums.CurrencyType.get(prefixCurrency)?.symbol;
    const formatted = moneyFormatter(
      this.onlyBrite ? (value / 2) : value,
      prefixCurrency === 2
    );

    if (!formatted) {
      return "";
    }

    return `(${currency} ${formatted})`;
  }

  get activeCurrency() {
    if (this.onlyBrite) {
      return this.currency
    }

    return this.hasFocus ? 1 : this.currency;
  }

  get briteValue() {
    if (this.onlyBrite) {
      return this.numericValue
    }

    return +this.numericValue * 2;
  }

  /*
    get formattedValue() {
      const value = this.activeCurrency === 1 ? this.numericValue : this.briteValue;

      if (this.value === null) {
        return ""
      }

      const newValue = this.$options.filters.moneyFormatter(
        value,
        this.activeCurrency === 2
      );

      //this.$refs.textInput && (this.$refs.textInput.$data.lazyValue = newValue);

      return newValue;
    }

    set formattedValue(value) {
      this.numericValue = this.$options.filters.moneyParser(value)
    }*/

  /*formatForEmit(value: number) {
    const formattedValue = this.$options.filters.moneyFormatter(value)

    let toEmit = formattedValue.toString();

    if (toEmit) {
      toEmit = +toEmit.replace(/\./g, "").replace(",", ".");
    }

    return isNaN(toEmit) ? null : toEmit;
  }*/

  onChange(value: number) {
    this.$emit("change", getValue(this.$refs.textInput));
  }

  onInput(value: number) {
    this.$emit("input", getValue(this.$refs.textInput));
  }

  onFocus() {
    this.hasFocus = true;
  }

  onBlur() {
    this.hasFocus = false;
  }

  onMaxClick() {
    const value = this.maxValue;

    this.$emit("input", value);
    this.$emit("change", value);
  }

  @Watch("value",)
  onValueChange(value: number) {
    console.log("watch")

    if (this.$refs.textInput) {
      setValue(this.$refs.textInput, value);
    }
  }

  @Watch("inputValue")
  onInputValueChange() {
    this.numericValue = getValue(this.$refs.textInput) as number
  }

  mounted() {
    setValue(this.$refs.textInput, this.value ?? null);

    this.$refs.textInput.resetValidation()
  }
};
</script>

<style scoped>

</style>
