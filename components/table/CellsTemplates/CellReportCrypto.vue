<template>
  <div style="list-style: none; font-size: .7rem" class="ps-0">
    <div v-for="(entry, i) in item.crypto" :key="i">
      <span class="text-no-wrap">€ {{ entry.amount|moneyFormatter }}</span>
      <span>{{ entry.cryptoCurrency }}</span> ({{ entry.cryptoAddress }})
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BasicCell from '~/components/table/CellsTemplates/BasicCell.vue'

@Component
export default class CellReportCrypto extends BasicCell {
  @Prop({ type: Object, required: true })
  public item!: any

}
</script>
