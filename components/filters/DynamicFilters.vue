<template>
  <collapse-transition easing="ease-in-out">
    <div v-if="expand" style="height: auto">
      <v-divider/>

      <v-card v-if="schema && formSchema"
              tile elevation="0" color="grey lighten-5">
        <v-card-title>Filtri</v-card-title>

        <v-card-text>
          <dynamic-fieldset :schema="formSchema"
                            v-model="activeFilters"
                            immediate-update/>
        </v-card-text>

        <v-divider/>

        <v-card-actions class="justify-center grey lighten-4">
          <v-btn color="primary" @click="applyFilters" :loading="loading||loadingData">
            {{ $t("filters.filter-btn") }}
          </v-btn>

          <v-btn @click="onClearClick" :disabled="loading" elevation="0">{{ $t("filters.cancel-btn") }}</v-btn>
        </v-card-actions>
      </v-card>

      <v-alert v-else-if="schema && !formSchema" type="error"
               outlined tile class="mb-0">
        Schema specificato non disponibile
      </v-alert>
    </div>
  </collapse-transition>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {CollapseTransition} from "@ivanv/vue-collapse-transition"
import DynamicFieldset from "../DynamicFieldset.vue";

import {FiltersSchemasType, schemas} from "~/config/forms/filters/index";
import {FormSchema, FormSchemaField} from "~/@types/FormSchema";

@Component({
  components: {
    DynamicFieldset: DynamicFieldset as any,
    CollapseTransition
  }
})
export default class DynamicFilters extends Vue {
  @Prop({type: String})
  schema!: FiltersSchemasType

  @Prop({type: Boolean, default: false})
  expand!: boolean

  @Prop({type: Object, default: () => ({})})
  value!: any

  @Prop({type: Object})
  inputsData!: any

  @Prop({type: Boolean, default: true})
  useStore!: boolean

  @Prop({type: Boolean, default: false})
  loading!: boolean

  @Prop({type: String})
  filtersKey!: string

  activeFilters: any = {}

  /**
   * The idea is that all filters are imported through the index file and when using the component,
   * i just need to specify the name of the schema to use, without needing to import the real schema.
   */
  get formSchema(): FormSchema[] {
    let schema = this.schema ? schemas[this.schema + "FiltersSchema"] : null

    return schema ? schema.call(this) : schema
  }

  get storedActiveFilters() {
    return this.$store.getters["filters/activeFilters"];
  }

  get loadingData() {
    return this.$store.state.filters.loading;
  }

  resetFilters() {
    const fields: Record<string, FormSchemaField> = this.formSchema.reduce((acc: any, curr: FormSchema) => {
      Object.entries(curr.cols).forEach(entry => {
        acc[entry[0]] = entry[1];
      });

      return acc
    }, {})

    for (let key of Object.keys(this.activeFilters)) {
      this.activeFilters[key] = fields[key]?.defaultValue ?? null
    }
  }

  applyFilters() {
    this.$nextTick(() => {
      const filters = Object.entries(this.activeFilters).reduce((acc: any, entry) => {
        const key: string = entry[0];
        const value: any = entry[1];

        if (![null, undefined].includes(value) && value !== "") {
          acc[key] = value
        }

        return acc;
      }, {})

      if (!this.useStore) {
        return this.$emit("applyFilters", filters)
      }

      this.$store.dispatch("filters/updatePage", {
        page: this.$route.path,
        activeFilters: filters
      })
    })
  }

  onClearClick() {
    if (!this.useStore) {
      return this.$emit("resetFilters")
    }

    this.$store.dispatch("filters/updatePage", {
      page: this.$route.path,
      activeFilters: null
    })
  }

  @Watch("storedActiveFilters")
  onStoredActiveFiltersChange(value: any) {
    if (!value || Object.keys(value).length === 0) {
      this.resetFilters()
    }
  }

  @Watch('value', {deep: true, immediate: true})
  onValueChange(val: any) {
    this.activeFilters = val
  }

  @Watch("activeFilters")
  onActiveFiltersChange(val: any) {
    this.$emit("input", val)
  }
}
</script>

<style scoped>
.collapse-fade-enter-active {
  transition: all .3s ease;
}

.collapse-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.collapse-fade-enter, .collapse-fade-leave-to {
  /*//transform: translateX(10px);*/
  opacity: 0;
  height: 0;
}
</style>
