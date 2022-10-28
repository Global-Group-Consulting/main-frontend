<template>
  <div>
    <v-tabs v-model="currentTab">
      <v-tab v-for="(tab, i) of visibileTabsList" :key="i">
        <v-icon class="mr-2" small>
          {{ tab.icon }}
        </v-icon>

        {{ tab.title }}
        <template v-if="tab.counter"> ({{ tab.counter }})</template>
      </v-tab>
    </v-tabs>

    <v-card class="mb-10" flat outlined>
      <v-card-text>

        <v-tabs-items :value="currentTab">
          <v-tab-item v-for="(tab, i) of visibileTabsList" :key="i">
            <v-skeleton-loader type="table-thead, table-tbody, table-tfoot"
                               :loading="!tab.data">
              <PaginatedTable :paginated-data="tab.data"
                              :columns="requestsSchema"
                              :condition="tab.refRole"
                              :table-key="tab.tableKey"
                              :options="tab.tableOptions"
                              :loading="tab.loading"
                              @update:pagination="onPaginationChanged"
              ></PaginatedTable>
            </v-skeleton-loader>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>

    <clients-list-dialog v-if="$store.getters['dialog/dialogId'] === 'ClientsListDialog'"/>
  </div>
</template>

<script lang="ts">
import DataTable from '~/components/table/DataTable.vue'
import CellRequestActions from '~/components/table/CellsTemplates/CellRequestActions.vue'
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { ComputedRef } from '@vue/composition-api'
import { Ref } from '@vue/composition-api'
import { PaginatedTab } from '~/@types/pagination/PaginatedTab'
import requestsSchema from '~/config/tables/requestsSchema'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { Filter } from '~/@types/Filter'
import RequestStatus from '~/enums/RequestStatus'

export default defineComponent({
  components: { CellRequestActions, DataTable },
  props: {
    userId: {
      type: String
    }
  },
  setup (props, { root, emit }) {
    const { $i18n, $alerts, $apiCalls } = root
    const currentTab = ref(0)

    const tabsList: Ref<PaginatedTab[]> = ref([
      {
        id: 'nuova',
        customKey: RequestStatus.NUOVA,
        title: $i18n.t(`pages.requests.tableNuova-title`) as string,
        data: null,
        color: 'blue',
        icon: 'mdi-timer-sand',
        tableKey: 'requests',
        loading: false,
        lastFetch: null,
        counter: 0,
        paginationDto: {
          sortBy: ['created_at', 'user'],
          sortDesc: [true]
        }
      },
      {
        id: 'lavorazione',
        customKey: RequestStatus.LAVORAZIONE,
        title: $i18n.t(`pages.requests.tableLavorazione-title`) as string,
        data: null,
        color: 'warning',
        icon: 'mdi-sitemap',
        tableKey: 'requests',
        loading: false,
        lastFetch: null,
        counter: 0,
        paginationDto: {
          sortBy: ['updated_at', 'created_at', 'user'],
          sortDesc: [true]
        }
      },
      {
        id: 'accettata',
        customKey: RequestStatus.ACCETTATA,
        title: $i18n.t(`pages.requests.tableAccettata-title`) as string,
        data: null,
        color: 'green',
        icon: 'mdi-check-all',
        tableKey: 'requests',
        loading: false,
        lastFetch: null,
        counter: 0,
        paginationDto: {
          sortBy: ['completed_at', 'created_at', 'user'],
          sortDesc: [true, false]
        }
      },
      {
        id: 'rifiutata',
        customKey: RequestStatus.RIFIUTATA,
        title: $i18n.t(`pages.requests.tableRifiutata-title`) as string,
        data: null,
        color: 'red',
        icon: 'mdi-close-box-multiple-outline',
        tableKey: 'requests',
        loading: false,
        lastFetch: null,
        counter: 0,
        paginationDto: {
          sortBy: ['completed_at', 'created_at', 'user'],
          sortDesc: [true, false]
        }
      }, {
        id: 'filters',
        title: 'Risultati ricerca',
        data: null,
        paginationDto: { sortBy: ['completed_at', 'created_at', 'user'] },
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

        if (tab.hasOwnProperty('if')) {
          return tab.if
        }

        return true
      })
    })

    const selectedTabId = computed(() => {
      return visibileTabsList.value[currentTab.value].id
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

    const areActiveFilters: ComputedRef<boolean> = computed(() => {
      return root.$store.getters['filters/areActiveFilters']
    })

    //********************************************************
    // FUNCTIONS
    //********************************************************

    /**
     * Fetches the data for the selected tab
     * @param {PaginationDto} paginationSettings
     */
    async function fetchData (paginationSettings: PaginationDto) {
      // store selectedTab internally so if in the meanwhile this changes,
      // we store the data for the correct tab
      const targetTab = selectedTab.value

      // if the tab is already loading, do nothing
      if (targetTab.loading) {
        return
      }

      targetTab.loading = true
      paginationSettings.filters = {
        status: targetTab.customKey
      }

      try {
        targetTab.data = await $apiCalls.requests.filter(paginationSettings)

        // store the current time to avoid to many fetches
        targetTab.lastFetch = new Date()
        targetTab.counter = targetTab.data?.total
      } catch (er) {
        $alerts.error(er)
      }

      targetTab.loading = false
    }

    /**
     * Fetches the counters for the tabs
     */
    async function fetchCounters () {
      try {
        const counters = await $apiCalls.requests.fetchCounters({})

        tabsList.value.forEach(tab => {
          tab.counter = counters.find(c => c._id === tab.customKey)?.count || 0
        })

      } catch (er) {
        $alerts.error(er)
      }
    }

    /**
     * Fetches the data for the filters tab
     * @param {PaginationDto} paginationSettings
     */
    async function filterData (paginationSettings: PaginationDto) {
      if (root.$store.state.filters.loading) {
        return
      }

      root.$store.dispatch('filters/updateLoading', true)

      try {
        filtersTab.value.data = await $apiCalls.requests.filter(paginationSettings)
        filtersTab.value.counter = filtersTab.value.data?.total

        currentTab.value = visibileTabsList.value.length - 1
      } catch (er) {
        $alerts.error(er)
      }

      root.$store.dispatch('filters/updateLoading', false)
    }

    /**
     * When the pagination changes, fetches the data for the selected tab
     * This can occur when the user changes the page or the sort order
     * @param {PaginationDto} paginationSettings
     */
    function onPaginationChanged (paginationSettings: PaginationDto) {
      // updates selectedTab pagination settings
      selectedTab.value.paginationDto = paginationSettings

      if (selectedTab.value.id === 'filters') {
        filterData({
          ...paginationSettings,
          filters: activeFilters.value,
          sortBy: selectedTab.value.paginationDto?.sortBy
        })
      } else {
        fetchData(paginationSettings)
      }
    }

    /**
     * When the currentTab changes, eventually fetches the data for the selected tab
     */
    watch(() => currentTab.value, () => {
      const now = new Date()
      const inXMinutes = selectedTab.value.lastFetch ? new Date(selectedTab.value.lastFetch) : null

      // nothing to fetch for the filters tab. Data will be fetched when the user clicks on the search button
      if (selectedTab.value.id === 'filters') {
        return
      }

      if (inXMinutes) {
        inXMinutes.setMinutes(inXMinutes.getMinutes() + 1)

        // If it has not passed 5 minutes, avoid fetching again
        if (now < inXMinutes) {
          return
        }
      }

      if (selectedTab.value.paginationDto) {
        fetchData(selectedTab.value.paginationDto)
      }
    }, {
      immediate: true
    })

    /**
     * When the active filters change, fetches the data for the filters tab
     * and eventually shows the filters tab
     */
    watch(() => activeFilters.value, () => {
      if (root.$store.getters['filters/areActiveFilters']) {
        filterData({
          filters: activeFilters.value,
          sortBy: selectedTab.value.paginationDto?.sortBy
        })
      }
    })

    onMounted(() => {
      // fetch counters only when starting the component
      // counters will be updated when the user loads data for each tab
      fetchCounters()
    })

    return {
      currentTab,
      visibileTabsList,
      requestsSchema,
      onPaginationChanged
    }
  }
})
</script>

<style></style>
