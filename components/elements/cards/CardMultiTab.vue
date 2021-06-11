<template>
  <single-card :value="tabData" :loading="loading">
    <template v-slot:title>
      <span class="text-trim" v-if="tabs.length === 1">{{ tabTitle }}</span>

      <v-menu offset-y v-model="menuOpened" v-else>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <span class="text-trim">{{ tabTitle }}</span>
            <v-icon color="primary" :class="{'rotate-180': menuOpened}">mdi-chevron-down</v-icon>
          </div>
        </template>

        <v-list>
          <v-list-item v-for="(tab, index) in tabs" :key="index"
                       @click="changeTab(index)">
            <v-list-item-title>{{ tab.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </single-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import SingleCard from "~/components/elements/cards/SingleCard.vue";
import {MenuListItem} from "~/@types/components/MenuListItem";
import {moneyFormatter} from "~/plugins/filters/moneyFormatter";
import {LargeCard} from "~/components/elements/cards/Cards";


@Component({
  components: {SingleCard}
})
export default class CardMultiTab extends Vue {
  @Prop({type: Array, default: () => []})
  tabs !: LargeCard[]

  @Prop({type: Boolean, default: false})
  loading!: boolean;

  menuOpened: boolean = false;
  currentTab: number = 0;
  filter: string = "";

  get tabTitle() {
    return this.tabs[this.currentTab]?.title
  }

  get tabData() {
    return this.tabs[this.currentTab]
  }

  changeTab(tabIndex: number) {
    this.currentTab = tabIndex
  }
}
</script>

<style scoped>

</style>
