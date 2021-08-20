<template>
  <small>
    <div class="d-flex text-no-wrap">
      <strong>Deposito</strong>:
      {{ value.deposit | moneyFormatter }}
    </div>

    <div class="d-flex text-no-wrap">
      <strong>Rendite</strong>:
      {{ value.interests | moneyFormatter }}
    </div>
  </small>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";
import SigningLogsPopup from "~/components/elements/SigningLogsPopup.vue";

@Component({
  components: {SigningLogsPopup}
})
export default class CellUserContractNumber extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  get value(): { deposit: number, interests: number } {
    return this.item?.earnings
  }
}
</script>

<style scoped>

</style>
