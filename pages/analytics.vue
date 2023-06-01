<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, onMounted, ref, watch } from '@vue/composition-api'
import { ReportsPermissions } from '~/functions/acl/enums/reports.permissions'
import { ApiCalls } from '~/plugins/apiCalls'
import moment from 'moment-timezone'
import humanizeDuration from 'humanize-duration'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import analyticFiltersSchema from '~/config/forms/filters/analyticFiltersSchema'
import { Filter } from '~/@types/Filter'
import { DynamicTab } from '~/@types/components/DynamicTab'

export default defineComponent({
  name: 'Analytics',
  meta: {
    permissions: [ReportsPermissions.REPORTS_READ]
  },
  setup (props, { root }) {
    const apiCalls = root.$apiCalls as ApiCalls
    const currentTab = ref(0)
    const tableSchema = ref({
      'user': {
        text: 'tables.user',
        value: 'user',
        width: '15%',
        component: 'CellUserName'
      },
      'role': {
        text: 'tables.role',
        value: 'user.role',
        width: '15%',
        component: 'CellUserRole',
        componentSettings: {
          item: 'user'
        }
      },
      'time': {
        text: 'tables.analytics.time',
        value: 'totalTime',
        width: '15%',
        sortable: false
      }
    })

    const tabsList = ref<any[]>([
          {
            id: 'analytics',
            title: 'Utilizzo',
            data: null,
            loading: true,
            updateData: (paginationDto: any) => fetchData(Object.assign(paginationDto, { filters: activeTabData.value.paginationDto.filters }), 'analytics'),
            paginationDto: {
              sortBy: ['user']
            }
          },
          {
            id: 'filters',
            title: 'Filtri',
            data: null,
            loading: true,
            updateData: (paginationDto: any) => fetchData(Object.assign(paginationDto, { filters: activeTabData.value.paginationDto.filters }), 'filters'),
            paginationDto: {
              sortBy: ['user']
            }
          }
        ]
    )
    const filtersSchema = computed(() => analyticFiltersSchema.call(root))
    const visibileTabsList = computed(() => tabsList.value.filter(tab => tab.id === 'filters' && areActiveFilters.value || tab.id !== 'filters'))
    const activeTabData = computed(() => visibileTabsList.value[currentTab.value])
    const filtersTab = computed(() => tabsList.value.find(tab => tab.id === 'filters'))

    const activeFilters: ComputedRef<Filter> = computed(() => {
      return root.$store.getters['filters/activeFilters']
    })

    const areActiveFilters: ComputedRef<boolean> = computed(() => {
      return root.$store.getters['filters/areActiveFilters']
    })

    async function fetchData (paginationSettings: PaginationDto, target: any = 'analytics') {
      const targetTab = tabsList.value.find(tab => tab.id === target)
      targetTab.loading = true

      try {
        const data = await apiCalls.analyticsApi.read(paginationSettings)

        targetTab.data = data
      } catch (e) {
        console.log(e)
      }

      targetTab.loading = false
    }

    function formatDuration (seconds: number) {
      return humanizeDuration(seconds * 1000, {
        language: 'it',
        largest: 2,
        units: ['d', 'h', 'm', 's'],
        round: true
      })
    }

    function formatTimers (timers: ITimer[][]): ITimer[] {
      const toReturn: any = {}

      timers.map(timer => {
        timer.forEach(t => {
          if (!toReturn[t.pageName]) {
            toReturn[t.pageName] = t
          }
          toReturn[t.pageName].totalTime += t.timeOnPage
        })
      })

      return Object.values(toReturn).sort((a: ITimer, b: ITimer) => a.pageName.localeCompare(b.pageName))
    }

    /**
     * When the active filters change, fetches the data for the filters tab
     * and eventually shows the filters tab
     */
    watch(() => activeFilters.value, () => {
      if (areActiveFilters.value) {
        if (filtersTab) {
          filtersTab.value.paginationDto = Object.assign({}, activeTabData.value.paginationDto, {
            filters: activeFilters.value
          })
        }

        fetchData(filtersTab.value.paginationDto, 'filters')

        currentTab.value = 1
      } else {
        currentTab.value = 0
      }
    })

    onMounted(async () => {
      await fetchData(activeTabData.value.paginationDto)
      activeTabData.value.loading = false
    })

    return {
      tableSchema,
      filtersSchema,
      currentTab,
      tabsList,
      visibileTabsList,
      fetchData,
      formatDuration,
      formatTimers
    }
  }
})

</script>

<template>
  <v-layout>
    <v-flex>
      <PageHeader page-name="analytics"></PageHeader>

      <PageToolbar ref="pageToolbarDiv"
                   always-visible
                   filter-on-enter
                   :filters-schema="filtersSchema"
      >
      </PageToolbar>

      <v-tabs v-model="currentTab" v-if="visibileTabsList.length > 1">
        <v-tab v-for="(tab, i) of visibileTabsList" :key="i">
          {{ tab.title }}
        </v-tab>
      </v-tabs>

      <v-card flat outlined>
        <v-card-text>
          <v-tabs-items :value="currentTab">
            <v-tab-item v-for="(tab, i) of visibileTabsList" :key="i">
              <v-skeleton-loader type="table-thead, table-tbody, table-tfoot"
                                 :loading="tab.loading">
                <PaginatedTable table-key="analytics"
                                :columns="tableSchema"
                                :paginated-data="tab.data"
                                class="border"
                                @update:pagination="tab.updateData"
                >
                  <template v-slot:item.totalTime="{item, value}">
                    <CardTooltip :title="formatDuration(value)">
                      <v-list dense>
                        <v-list-item v-for="timer in formatTimers(item.timers)" :key="timer.pageName"
                                     style="min-height: 30px">
                          <v-list-item-content>
                            <small><strong>{{ timer.pageName }}</strong>: {{
                                formatDuration(timer.timeOnPage)
                              }}</small>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </CardTooltip>
                  </template>
                </PaginatedTable>
              </v-skeleton-loader>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped lang="scss">

</style>
