<template>
  <v-card class="flex-fill flex-row d-flex align-start" style="height: 100%">
    <v-icon x-large class="ml-3 mt-3" :color="cardData.color">
      {{ cardData.icon }}
    </v-icon>

    <div style="width: 100%">
      <v-card-title class="pb-0 text-no-wrap">
        <template v-if="!formatAsInt">
          €
          {{ $options.filters.moneyFormatter(cardData.value) }}
        </template>
        <template v-else>
          {{ cardData.value }}
        </template>
      </v-card-title>
      <v-card-text>
        {{ cardData.title }}
      </v-card-text>

      <v-card-actions class="text-right pt-0 transparent"
                      v-if="cardData.action">
        <v-btn link text small color="primary" @click="cardData.action">
          {{ cardData.actionText }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {BlockData} from "~/config/blocks/dashboardBlocks";

@Component({})
export default class DashboardCard extends Vue {
  @Prop({type: Object, default: () => ({})})
  cardData!: BlockData

  @Prop({type: Boolean, default: false})
  formatAsInt!: boolean;
}
</script>

<style scoped>

</style>
