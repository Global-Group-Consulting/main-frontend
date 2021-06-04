<template>
  <span>
    {{ value }}
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component({})
export default class CellUserClubCardNumber extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: String})
  public value!: any
}
</script>

<style scoped>

</style>
