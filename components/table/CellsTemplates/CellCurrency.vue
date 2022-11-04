<template>
  <span>
    {{ formatRequestCurrency(+value) }}
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";
import CurrencyType from '~/enums/CurrencyType'

@Component({})
export default class CellCurrency extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: [Number, String]})
  public value!: number | string

  formatRequestCurrency(value: number) {
    // by default the currency is €
    const currencyData = CurrencyType.get(value || CurrencyType.EURO);

    return `${currencyData.symbol} (${this.$t(`enums.CurrencyType.${currencyData.id}`)})`;
  }
}
</script>

<style scoped>

</style>
