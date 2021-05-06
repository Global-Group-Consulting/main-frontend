import {Moment} from "moment";

export interface DynamicTab {
  id: "briteTotal" | "briteUsed" | "briteAvailable" | string | number
  title?: string
  data?: any[]
  updateMethod?: string
  dates?: { from: Moment, to: Moment },
  useFrom?: Moment
  expiresAt?: Moment
}
