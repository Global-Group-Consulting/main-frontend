<template>
  <div>
    <v-tabs v-model="currentTab" v-if="visibileTabsList.length > 1">
      <v-tab v-for="(tab, i) of visibileTabsList" :key="i">
        <v-icon class="mr-2" small>
          {{ tab.icon }}
        </v-icon>

        {{ tab.title }}
        <template v-if="tab.counter"> ({{ tab.counter }})</template>
      </v-tab>
    </v-tabs>

    <v-card flat :outlined="!flat">
      <v-card-text :class="flat ? 'px-0 pb-0' : ''">

        <v-tabs-items :value="currentTab">
          <v-tab-item v-for="(tab, i) of visibileTabsList" :key="i">
            <v-skeleton-loader type="table-thead, table-tbody, table-tfoot" :loading="!tab.data">
              <PaginatedTable :paginated-data="tab.data"
                              :columns="tableSchema"
                              :condition="tab.id"
                              table-key="movements"
                              :options="tab.tableOptions"
                              :loading="tab.loading"
                              :item-class="getItemClass"
                              @update:pagination="onPaginationChanged"
              ></PaginatedTable>
            </v-skeleton-loader>
          </v-tab-item>
        </v-tabs-items>

      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">

import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api'
import DataTable from '~/components/table/DataTable.vue'
import MovementTypes from '~/enums/MovementTypes'
import { Movement } from '~/@types/Movement'
import { PaginatedTab } from '~/@types/pagination/PaginatedTab'
import RequestStatus from '~/enums/RequestStatus'
import movementsSchema from '~/config/tables/movementsSchema'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { Filter } from '~/@types/Filter'

export default defineComponent({
  components: { DataTable },
  props: {
    userId: { type: String, required: true },
    flat: { type: Boolean, default: true }
  },
  setup (props, { root }) {
    const { $i18n } = root
    const movements: Ref<Movement[]> = ref([])
    const currentTab = ref(0)
    const tableSchema = movementsSchema

    const tabsList: Ref<PaginatedTab[]> = ref([
      {
        id: 'tutti',
        title: 'Tutti i movimenti',
        data: null,
        color: 'blue',
        icon: 'mdi-timer-sand',
        tableKey: 'requests',
        loading: false,
        lastFetch: null,
        counter: 0,
        paginationDto: {
          sortBy: ['created_at'],
          sortDesc: [true]
        }
      }, {
        id: 'filters',
        title: 'Risultati ricerca',
        data: null,
        paginationDto: {
          sortBy: ['created_at'],
          sortDesc: [true]
        },
        tableKey: 'requestsFilter',
        loading: false,
        lastFetch: null,
        counter: 0
      }
    ])

    //********************************************************
    // COMPUTED PROPS
    //********************************************************

    // show only basic tabs and eventually show also filters tab if user has filters active
    const visibileTabsList: ComputedRef<PaginatedTab[]> = computed(() => {
      return tabsList.value.filter(tab => {
        if (tab.id === 'filters') {
          return areActiveFilters.value
        }

        /*if (props.tabs) {
          return props.tabs.includes(tab.id)
        }*/

        if (tab.hasOwnProperty('if')) {
          return tab.if
        }

        return true
      })
    })

    const selectedTabId = computed(() => {
      return visibileTabsList.value[currentTab.value]?.id
    })

    const selectedTab: ComputedRef<PaginatedTab> = computed(() => {
      return tabsList.value.find(tab => tab.id === selectedTabId.value) as PaginatedTab
    })

    const filtersTab: ComputedRef<PaginatedTab> = computed(() => {
      return tabsList.value.find(tab => tab.id === 'filters') as PaginatedTab
    })

    const activeFilters: ComputedRef<Filter> = computed(() => {
      return root.$store.getters['filters/activeFilters']
    })

    const areActiveFilters = computed(() => {
      return root.$store.getters['filters/areActiveFilters']
    })

    //********************************************************
    // FUNCTIONS
    //********************************************************

    /**
     * Get class for each row. If the row refers to a recapitalization, highlight it.
     * @param {Movement} item
     */
    function getItemClass (item: Movement) {
      if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
        return 'yellow lighten-5'
      }

      if (item.movementType.toString() === 'temp') {
        return 'grey lighten-4 grey--text'
      }
    }

    /**
     * Fetch data from API
     */
    async function fetchData (paginationSettings: PaginationDto, tab?: PaginatedTab, filtering?: boolean) {
      const targetTab = tab ?? selectedTab.value

      if (filtering) {
        if (root.$store.state.filters.loading) {
          return
        }

        root.$store.dispatch('filters/updateLoading', true)
      }

      try {
        // store selectedTab internally so if in the meanwhile this changes,
        // we store the data for the correct tab

        // if the tab is already loading, do nothing
        if (targetTab.loading) {
          return
        }

        targetTab.loading = true

        targetTab.data = await root.$apiCalls.movementApi.filter(props.userId, paginationSettings)
        targetTab.counter = targetTab.data?.total ?? 0

      } catch (er) {
        console.error(er)
      }

      targetTab.loading = false

      if (filtering) {
        root.$store.dispatch('filters/updateLoading', false)
        currentTab.value = tabsList.value.findIndex(tab => tab.id === 'filters')
      }
    }

    async function onPaginationChanged (paginationDto: any, tab?: PaginatedTab) {
      const targetTab = tab ?? selectedTab.value

      targetTab.paginationDto = paginationDto

      await fetchData(paginationDto, targetTab)
    }

    /**
     * When the active filters change, fetches the data for the filters tab
     * and eventually shows the filters tab
     */
    watch(() => activeFilters.value, () => {
      if (root.$store.getters['filters/areActiveFilters']) {
        fetchData({
          filters: activeFilters.value,
          sortBy: filtersTab.value.paginationDto?.sortBy,
          sortDesc: filtersTab.value.paginationDto?.sortDesc
        }, filtersTab.value, true)
      } else {
        if (currentTab.value === tabsList.value.findIndex(tab => tab.id === 'filters')) {
          currentTab.value = 0
        }
      }
    })

    function reloadData () {
      fetchData(selectedTab.value.paginationDto as PaginationDto)
    }

    onMounted(() => {
      fetchData(selectedTab.value.paginationDto as PaginationDto)
    })

    return {
      movements,
      currentTab,
      tableSchema,
      visibileTabsList,
      tabsList,
      getItemClass,
      onPaginationChanged,
      reloadData
    }
  }
})
</script>
