<template>
  <div>
    <v-tabs v-model="currentTab">
      <v-tab v-for="(tab, i) of tabsList" :key="i">
        {{ tab.title }}
      </v-tab>

      <transition-group name="fadeRight" tag="div" class="d-flex">
        <v-tab :key="99" v-if="filtersActive.length">
          <v-icon class="mr-2">mdi-magnify</v-icon>

          Risultati ricerca

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
          <v-tab-item v-for="(tab, i) of tabsList" :key="i">
            <slot :name="'tabContent_' + tab.id" v-bind:item="tab"></slot>
            <slot v-bind:item="tab"></slot>
          </v-tab-item>

          <v-tab-item :key="99" v-if="filtersActive.length">
            <data-table
              :items="filteredData"
              :items-per-page="25"
              table-key="usersFilter"
              schema="usersSchema"
              light
              id="searchTableResults"
            >
              <template v-for="key of filterTableKeys"
                        v-slot:[`item.${key}`]="{ item, value }">
                <slot :name="'filterTable_' + key" :item="item" :value="value"/>
              </template>
            </data-table>
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

@Component({
  components: {DataTable}
})
export default class DynamicTabs extends Vue {
  @Prop({required: true, type: Array})
  public tabsList!: DynamicTabs[]

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

  @Prop({type: Array, default: () => []})
  public filtersActive!: any[]

  public currentTab = this.value
  public lastTab = this.currentTab

  get tabsData() {
    return this.tabsList.map(tab => tab.data).flat() || []
  }

  get filteredData() {
    const result = []

    const filterValue = this.filtersActive[0]?.generic.toLowerCase().trim().split(" ")

    const filterRegex = new RegExp(filterValue.reduce((acc, curr) => {
      if (curr) {
        const val = curr.trim()

        if (val) {
          acc.push(val)
        }
      }

      return acc
    }, []).join("|"), "g")

    console.log(filterRegex)

    for (let el of this.tabsData) {
      const valuesToSearchIn = [el.firstName.toLowerCase(), el.lastName.toLowerCase(), el.email.toLowerCase()]

      const resFound = valuesToSearchIn.some((substr) => {
        /** @type {String[]} */
        const match = substr.match(filterRegex)

        return match && filterRegex.source.split("|").every((currentValue) => match.includes(currentValue))
      })

      if (resFound) {
        result.push(el)
      }
    }

    return result
  }

  get filterTableKeys() {
    const data = this.tabsData[0]
    const toReturn = ["actions"]

    if (!data) {
      return toReturn
    }

    return toReturn.concat(Object.keys(data))
  }

  filtersClean() {
    this.$emit("filtersClean")
    // must emit an event
  }

  @Watch('filtersActive')
  onFiltersActiveChange(value) {
    const maxTabs = this.tabsList.length

    if (value.length > 0) {
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
