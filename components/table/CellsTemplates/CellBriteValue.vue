<template>
  <span>
    <span v-if="showCurrency">Br'</span>

    {{ (value || 0) | moneyFormatter(true) }}
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component({})
export default class CellBriteValue extends Vue {
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
