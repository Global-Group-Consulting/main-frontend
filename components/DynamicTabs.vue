<template>
  <div>
    <v-tabs v-model="currentTab">
      <v-tab v-for="(tab, i) of tabsList" :key="i">
        {{ tab.title }}
      </v-tab>
    </v-tabs>

    <v-card class="mb-10" flat :color="color"
            :outlined="outlined">
      <v-card-text :class="cardTextClass">
        <v-tabs-items :value="currentTab">
          <v-tab-item v-for="(tab, i) of tabsList" :key="i">
            <slot :name="'tabContent_' + tab.id" v-bind:item="tab"></slot>
            <slot v-bind:item="tab"></slot>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'

@Component
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

  public currentTab = this.value

  @Watch('currentTab')
  onTabChange(value: string) {
    this.$emit("tabChange", value)
    this.$emit("input", value)
  }

}
</script>

<style scoped>

</style>
