<template>
  <v-sheet class="mb-10"
           :color="styles.color || 'white'"
           v-bind="styles">
    <v-toolbar flat
               dense
               :color="styles.color || 'white'"
               v-if="$vuetify.breakpoint.smAndUp || alwaysVisible"
    >
      <v-toolbar-items class="flex-fill">
        <slot name="left-block">
          <page-toolbar-single-slot :actions-list="leftActionsList"/>
        </slot>

        <v-spacer></v-spacer>

        <slot name="center-block">
          <page-toolbar-single-slot :actions-list="centerActionsList"/>
        </slot>

        <v-spacer></v-spacer>


        <slot name="right-block">
          <page-toolbar-single-slot :actions-list="rightActionsList"/>
        </slot>
      </v-toolbar-items>
    </v-toolbar>

    <slot name="filters">
      <dynamic-filters v-if="includeFilters"
                       :schema="filtersSchema"
                       :expand="useStore ? filtersExpand : filtersExpanded"
                       :value="value"
                       @input="$emit('input', $event)"
      ></dynamic-filters>
    </slot>

    <mobile-menu-actions :actions-list="actionsList"></mobile-menu-actions>

    <v-divider v-if="borderBottom"></v-divider>

  </v-sheet>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {ActionItem, ActionItemOptions} from "~/@types/ActionItem";
import DynamicFilters from "~/components/filters/DynamicFilters.vue";
import MobileMenuActions from "~/components/MobileMenuActions.vue";
import PageToolbarSingleSlot from "~/components/blocks/pageToolbar/PageToolbarSingleSlot.vue";

@Component({
  components: {PageToolbarSingleSlot, MobileMenuActions, DynamicFilters}
})
export default class PageToolbar extends Vue {
  @Prop({type: Boolean, default: false})
  public alwaysVisible!: boolean;

  @Prop({type: Array as () => ActionItem[], default: () => [],})
  public actionsList!: ActionItem[];

  @Prop({type: String})
  filtersSchema!: string

  @Prop({type: Boolean, default: false})
  filtersExpanded!: boolean

  @Prop({type: Boolean, default: true})
  useStore!: boolean

  @Prop({type: Boolean, default: false})
  borderBottom!: boolean

  @Prop({type: Object, default: () => ({})})
  value!: any

  @Prop({type: Object, default: () => ({outlined: true, elevation: 2, rounded: true})})
  styles!: any

  @Prop({type: Boolean, default: false})
  hideFiltersButton!: boolean


  get includeFilters() {
    return !!this.filtersSchema;
  }

  get filtersExpand() {
    if (this.useStore) {
      return this.$store.getters["filters/expanded"];
    } else {
      return this.filtersExpanded
    }
  }

  get countActiveFilters(): number {
    return this.$store.getters["filters/countActiveFilters"]
  }

  get leftActionsList(): ActionItem[] {
    return this.actionsList
      .filter((action: ActionItem) => {
          return action.position === "left" && !action.onlyInMobile
        }
      )
  }

  get centerActionsList(): ActionItem[] {
    return this.actionsList
      .filter((action: ActionItem) => {
          return (action.position === "center" || !action.position) && !action.onlyInMobile
        }
      )
  }

  get rightActionsList(): ActionItem[] {
    const toReturn: ActionItem[] = this.actionsList
      .filter((action: ActionItem) => {
        return action.position === "right" && !action.onlyInMobile
      })

    if (this.includeFilters && !this.hideFiltersButton) {
      // By default adds filter button, only if there is a schema to use
      toReturn.push({
        text: "",
        html: this.$t("actions.filters-btn") + (this.countActiveFilters ? ` (${this.countActiveFilters})` : ''),
        icon: this.filtersExpand ? "mdi-filter-minus-outline" : "mdi-filter-menu",
        click: () => {
          this.$store.dispatch("filters/updateExpanded", !this.filtersExpand) //this.filtersExpand = !this.filtersExpand,
          this.$emit("expandedChanged", !this.filtersExpand)
        },
        onlyInDesktop: true,
      })
    }

    return toReturn
  }

  onAppliedFilter(activeFilters: any) {
    this.$emit("appliedFilters", activeFilters)
  }

  @Watch("filtersExpanded", {immediate: true})
  onExpandedPropChange(value: boolean) {

  }
}
</script>

<style scoped>

</style>
