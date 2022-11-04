<template>
  <span>
    {{ (value || 0) | dateFormatter(includeTime) }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class CellDate extends Vue {
  @Prop({ type: Object, required: true })
  public item!: any

  @Prop({ type: String })
  public value!: any

  @Prop({ type: Boolean })
  public includeTime!: boolean

}
</script>

<style scoped>

</style>
