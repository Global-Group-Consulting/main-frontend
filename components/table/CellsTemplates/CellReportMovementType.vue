<template>
  <span class="text-no-wrap">{{ computedValue }}</span>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import BasicCell from "~/components/table/CellsTemplates/BasicCell.vue";
import RequestTypes from "~/enums/RequestTypes";
import MovementTypes from "~/enums/MovementTypes";

@Component
export default class CellReportMovementType extends BasicCell {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: Number})
  public value!: number

  get computedValue() {
    if (!this.item._id.requestType) {
      return this.$t("enums.MovementTypes." + MovementTypes.get(this.item._id.movementType).id);
    }

    let reqType = this.item._id.requestType
    const classicReq = reqType === RequestTypes.RISC_INTERESSI

    // Se un utente ha fatto classic ma è gold la richiesta viene scaricata in gold (NON FISICO)
    if (this.item.user.gold && classicReq) {
      reqType = RequestTypes.RISC_INTERESSI_BRITE;
    }

    const id = RequestTypes.get(reqType).id;

    return this.$t("enums.RequestTypes." + id);
  }
}
</script>
