<template>
  <div>
    <v-tabs v-model="currentTab">
      <v-tab v-for="(tab, i) of tabsList" :key="i">
        <v-icon class="mr-2" small
                :color="getTabColor(tab)">
          {{ tab.icon }}
        </v-icon>

        {{ tab.title }}
      </v-tab>

      <transition-group name="fadeRight" tag="div" class="d-flex">
        <v-tab :key="99" v-if="filteredData">
          <v-icon class="mr-2">mdi-magnify</v-icon>

          Risultati ricerca ({{ filteredData.length }})

          <v-btn icon small @click="filtersClean" class="ml-2">
            <v-icon small>
              mdi-close
            </v-icon>
          </v-btn>
        </v-tab>
      </transition-group>
    </v-tabs>

    <v-progress-linear
      indeterminate
      v-if="loading"
      color="yellow darken-2"
    ></v-progress-linear>

    <v-card class="mb-10" flat :color="color"
            :outlined="outlined">
      <v-card-text :class="cardTextClass">
        <v-tabs-items :value="currentTab">
          <!-- Renders all tabs -->
          <v-tab-item v-for="(tab, i) of tabsList" :key="i">
            <slot :name="'tabContent_' + tab.id" v-bind:item="tab"></slot>
            <slot v-bind:item="tab"></slot>
          </v-tab-item>

          <!-- Renders filters tabs -->
          <v-tab-item :key="99" v-if="filteredData">
            <filters-table :table-key="filtersTableKey"
                           :schema="filtersSchema"
                           :filters-map="filtersFieldsMap"
                           :data-to-filter="filtersFullData"
            ></filters-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import DataTable from "~/components/table/DataTable.vue";
import {computed, reactive, ref, watch} from "@vue/composition-api";
import {DynamicTab} from "~/@types/components/DynamicTab";
import FiltersTable from "~/components/table/FiltersTable.vue";

@Component({
  components: {FiltersTable, DataTable}
})
export default class DynamicTabs extends Vue {
  @Prop({required: true, type: Array})
  public tabsList!: DynamicTab[]

  @Prop({type: String})
  public color!: string

  @Prop({type: Number, default: 0})
  public value!: number

  @Prop({type: Boolean})
  public outlined!: boolean

  @Prop({type: String})
  public cardTextClass!: string

  @Prop({type: Boolean, default: false})
  public loading!: string

  /*  @Prop({type: Array, default: () => null})
    public filteredData!: any[] | null*/

  @Prop({type: String})
  filtersTableKey!: string

  @Prop({type: String})
  filtersSchema!: string

  @Prop({type: Object})
  filtersFieldsMap!: any

  @Prop({type: Array})
  filtersFullData!: any[]

  public currentTab = this.value
  public lastTab = this.currentTab

  get tabsData() {
    return this.tabsList.map(tab => tab.data).flat() || []
  }

  get filteredData() {
    return this.$store.getters["filters/filteredData"]
  }

  get areActiveFilters() {
    return this.$store.getters["filters/areActiveFilters"]
  }

  get countFilteredData() {
    return this.$store.getters["filters/countFilteredData"]
  }

  filtersClean() {
    this.$store.dispatch("filters/updatePage", {
      page: this.$route.path,
      activeFilters: null
    })
  }

  getTabColor(tab: any) {
    const activeTabData = this.tabsList[this.currentTab];

    if (!activeTabData) {
      return
    }

    return activeTabData.id === tab.id ? tab.color : ''
  }

  @Watch('areActiveFilters')
  onFiltersActiveChange(value: boolean) {
    const maxTabs = this.tabsList.length

    if (value) {
      if (this.currentTab !== maxTabs) {
        this.lastTab = this.currentTab
        this.currentTab = maxTabs
      }
    } else if (this.currentTab === maxTabs) {
      this.currentTab = this.lastTab
    }
  }

  @Watch('currentTab')
  onTabChange(value: string) {
    this.$emit("tabChange", value)
    this.$emit("input", value)
  }

}
</script>

<style scoped>

</style>
