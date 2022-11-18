import { Moment } from 'moment'
import { AsyncComponent, Component } from 'vue/types/options'
import { Vue } from 'vue/types/vue'
import { ExtraFiltersSchemaEntry } from '~/components/filters/DashboardCardFilters.vue'

export interface DynamicTab {
  id: 'briteTotal' | 'briteUsed' | 'briteAvailable' | string | number
  title?: string
  component?: typeof Vue
  data?: any[]
  updateMethod?: string
  dates?: { from: Moment, to: Moment },
  useFrom?: Moment
  expiresAt?: Moment
  multiSort?: boolean
  color?: string
  icon?: string
  sortBy?: string[]
  sortDesc?: string[] | boolean[]
  
  mustReload?: boolean
  loading?: boolean
  filters?: any
  filterMessages?: string[]
  extraFiltersSchema?: ExtraFiltersSchemaEntry[]
}
