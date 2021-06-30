<template>
  <v-card class="flex-fill flex-row d-flex align-start" style="height: 100%">
    <v-icon x-large class="ml-3 mt-3" :color="cardData.color"
            v-text="cardData.icon">
    </v-icon>

    <div style="width: 100%">
      <v-card-title class="pb-0 text-no-wrap">
        <template v-if="!formatAsInt">
          {{ currency }}
          {{ $options.filters.moneyFormatter(cardData.value, currency !== "€") }}
        </template>
        <template v-else>
          {{ cardData.value }}
        </template>

        <small class="font-italic font-weight-regular caption" v-if="cardData.valueDetails" v-html="cardData.valueDetails"></small>
      </v-card-title>

      <v-card-text>
        <slot :name="`card_text_${cardData.slotId}`" v-bind="{item: cardData}">
          <span v-if="!cardData.dropDown">{{ cardData.title }}</span>

          <v-menu offset-y v-model="menuOpened" v-else>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <span class="text-trim">{{ cardData.title }}</span>
                <v-icon color="primary" :class="{'rotate-180': menuOpened}">mdi-chevron-down</v-icon>
              </div>
            </template>

            <v-list>
              <v-list-item-group
                v-model="activeTab"
                color="primary"
              >
                <v-list-item @click="changeTab(entry[0])"
                             v-for="entry of Object.entries(cardData.dropDown)"
                             :key="entry[0]"
                             :value="entry[0]">
                  <v-list-item-title>{{ entry[1].label }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </slot>
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
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {BlockData} from "~/config/blocks/dashboardBlocks";

@Component({})
export default class DashboardCard extends Vue {
  @Prop({type: Object, default: () => ({})})
  cardData!: BlockData

  @Prop({type: Boolean, default: false})
  formatAsInt!: boolean;

  menuOpened: boolean = false;
  activeTab: string = "";
  currency: string = "€";

  get showImage() {
    return this.cardData.icon && this.cardData.icon.startsWith("/");
  }

  changeTab(newTab: string) {
    if (this.cardData.onDropDownChange) {
      this.cardData.onDropDownChange(this.cardData, newTab)
    }
  }

  @Watch("cardData", {deep: true, immediate: true})
  onCardDataChange(value: BlockData) {
    this.currency = value.currency || "€";
  }
}
</script>

<style scoped>

</style>
