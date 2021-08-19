<template>

</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class BasicCell extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop()
  public value!: any

  @Prop({type: Object})
  colConfig!: any

  @Prop({type: Array})
  tableData!: []
}
</script>
