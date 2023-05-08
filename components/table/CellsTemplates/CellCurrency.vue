<template>
  <span>
    {{ formatRequestCurrency(+value) }}
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";
import CurrencyType from '~/enums/CurrencyType'
import CryptoCurrency from '~/enums/CryptoCurrency'

@Component({})
export default class CellCurrency extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: [Number, String]})
  public value!: number | string

  formatRequestCurrency(value: number) {
    // by default the currency is €
    const currencyData = CurrencyType.get(value || CurrencyType.EURO)
    let enumName = 'CurrencyType'

    if (this.item.cryptoCurrency) {
      currencyData.symbol = CryptoCurrency.get(this.item.cryptoCurrency).symbol
      currencyData.id = CryptoCurrency.get(this.item.cryptoCurrency).id

      return `${currencyData.symbol} (${CryptoCurrency.get(this.item.cryptoCurrency).text})`
    }

    return `${currencyData.symbol} (${this.$t(`enums.${enumName}.${currencyData.id}`)})`
  }
}
</script>

<style scoped>

</style>
