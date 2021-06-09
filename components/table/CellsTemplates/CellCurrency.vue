<template>
  <span>
    {{ formatRequestCurrency(+value) }}
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellCurrency extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: [Number, String], required: true})
  public value!: number | string

  formatRequestCurrency(value: number) {
    const currencyData = this.$enums.CurrencyType.get(value);

    return `${currencyData.symbol} (${this.$t(`enums.CurrencyType.${currencyData.id}`)})`;
  }
}
</script>

<style scoped>

</style>
