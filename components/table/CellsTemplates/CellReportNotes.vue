<template>
  <small v-html="computedValue"></small>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import BasicCell from "~/components/table/CellsTemplates/BasicCell.vue";

@Component
export default class CellReportNotes extends BasicCell {
  @Prop({type: Object, required: true})
  public item!: any

  get computedValue() {
    if (this.value instanceof Array) {
      return this.value.join("<br>")
    }

    return this.value
  }

}
</script>
