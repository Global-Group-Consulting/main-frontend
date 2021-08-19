<template>
  <small v-html="computedValue.join('<br>')"></small>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import BasicCell from "~/components/table/CellsTemplates/BasicCell.vue";

@Component
export default class CellReportIban extends BasicCell {
  @Prop({type: Object, required: true})
  public item!: any

  get computedValue() {
    const toReturn = [];

    if (this.item.user && this.item.user.contractIban) {
      toReturn.push(this.item.user.contractIban)
    }

    if (this.item.request && this.item.request.iban) {
      toReturn.push(this.item.request.iban)
    }

    return toReturn
  }

}
</script>
