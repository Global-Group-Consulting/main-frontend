<template>
  <span>
    {{ (value || 0) | moneyFormatter() }}

    <span v-if="showCurrency">€</span>
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component({})
export default class CellEuroValue extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: Number})
  public value!: any

  @Prop({type: Boolean})
  public showCurrency!: any
}
</script>

<style scoped>

</style>
