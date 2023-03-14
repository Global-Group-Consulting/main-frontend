<template>
  <v-card @mouseenter="mouseOver = true" @mouseleave="mouseOver = false" min-height="100%"
          :outlined="outlined">
    <!-- Menu for card title -->
    <v-toolbar flat>
      <v-toolbar-title class="text-h6 pl-0">
        <v-menu offset-y v-model="menuOpened"
                :disabled="tabs.length === 1">
          <!-- Menu activator -->
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              {{ currentTab.title }}
              <v-icon color="primary"
                      :class="{'rotate-180': menuOpened}"
                      v-if="tabs.length > 1">
                mdi-chevron-down
              </v-icon>
            </div>
          </template>

          <!-- Menu list items -->
          <v-list>
            <v-list-item v-for="(tab, i) in tabs" :key="tab.id"
                         @click="onMenuOptionClick(i)">
              <v-list-item-title>{{ tab.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Reload data button -->
      <tooltip-btn v-if="mouseOver || currentTab.loading"
                   :delay="500"
                   icon
                   tooltip="Aggiorna i dati"
                   :loading="currentTab.loading"
                   @click="currentTab.mustReload = true"
      >
        <v-icon>mdi-reload</v-icon>
      </tooltip-btn>

      <!-- Filters button and dropdown menu-->
      <template v-if="canFilter">
        <DashboardCardFilters :filters.sync="activeFilters"
                              :extra-filters-schema="currentTab.extraFiltersSchema"
                              @update:filterMessages="currentTab.filterMessages = $event"></DashboardCardFilters>
      </template>
    </v-toolbar>

    <!-- Sottotitolo filtri attivi -->
    <v-card-subtitle v-if="currentTab.filterMessages && currentTab.filterMessages.length"
                     class="pt-0">
      <strong>Filtri attivi:</strong><br>
      {{ currentTab.filterMessages.join(', ') }}
    </v-card-subtitle>

    <v-card-text class="pt-0 ps-0">
      <v-tabs-items v-model="currentTabIndex">
        <v-tab-item v-for="tab in tabs" :key="tab.id">

          <!-- Card content -->
          <!-- using :must-reload.sync to handle like v-model a custom property -->
          <component :is="tab.component"
                     :must-reload.sync="tab.mustReload"
                     :loadingData.sync="tab.loading"
                     :filters="currentTab.filters"
          ></component>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from '@vue/composition-api'
import { DynamicTab } from '~/@types/components/DynamicTab'
import DashboardCardFilters, { ExtraFiltersSchemaEntry } from '~/components/filters/DashboardCardFilters.vue'

export default defineComponent({
  name: 'DashboardBasicCard',
  components: { DashboardCardFilters },
  props: {
    tabs: {
      type: Array as PropType<DynamicTab[]>,
      required: true
    },
    canFilter: Boolean,
    outlined: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const currentTabIndex = ref(0)
    const menuOpened = ref(false)
    const mouseOver = ref(false)

    const currentTab: Ref<DynamicTab> = computed(() => props.tabs[currentTabIndex.value])
    const activeFilters = computed({
      get () {
        return currentTab.value.filters
      },
      set (value: any) {
        console.log('set filters', value)

        // store new filters in current tab
        currentTab.value.filters = { ...value }

        // each time filters are changed, reload data
        currentTab.value.mustReload = true
      }
    })

    function onMenuOptionClick (newIndex: number) {
      currentTabIndex.value = newIndex
    }

    return {
      currentTabIndex,
      currentTab,
      menuOpened,
      mouseOver,
      activeFilters,
      onMenuOptionClick
    }
  }
})
</script>

<style scoped>

</style>
