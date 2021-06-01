<template>
  <v-sheet class="mb-10" color="white"
           rounded outlined elevation="2">
    <v-toolbar flat
               dense
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

    <dynamic-filters v-if="includeFilters"
                     :schema="filtersSchema" :expand="filtersExpand"
    ></dynamic-filters>

    <mobile-menu-actions :actions-list="actionsList"></mobile-menu-actions>
  </v-sheet>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
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

  get includeFilters() {
    return !!this.filtersSchema;
  }

  get filtersExpand() {
    return this.$store.getters["filters/expanded"];
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

    if (this.includeFilters) {
      // By default adds filter button, only if there is a schema to use
      toReturn.push({
        text: "",
        html: this.$t("actions.filters-btn") + (this.countActiveFilters ? ` (${this.countActiveFilters})` : ''),
        icon: this.filtersExpand ? "mdi-filter-minus-outline" : "mdi-filter-menu",
        click: () => this.$store.dispatch("filters/updateExpanded", !this.filtersExpand), //this.filtersExpand = !this.filtersExpand,
        onlyInDesktop: true,
      })
    }

    return toReturn
  }

  onAppliedFilter(activeFilters: any) {
    this.$emit("appliedFilters", activeFilters)
  }

}
</script>

<style scoped>

</style>
