import {Moment} from "moment";

export interface DynamicTab {
  id: "briteTotal" | "briteUsed" | "briteAvailable" | string | number
  title?: string
  component?: string
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
}
