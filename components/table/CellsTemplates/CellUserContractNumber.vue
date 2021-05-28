<template>
  <span v-if="user">
    {{ $options.filters.contractNumberFormatter(user.contractNumber) }}
  </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserContractNumber extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  get user(): User {
    return this.item?.user
  }
}
</script>

<style scoped>

</style>
