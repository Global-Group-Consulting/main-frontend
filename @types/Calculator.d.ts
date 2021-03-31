import {Moment} from "moment";

export interface Movement {
  id: number
  date: number
  type: number
  amount: number
}

export interface QuotationEntry {
  date: number
  depositAdded: number
  depositCurrent: number
  depositCollected: number
  interestAmount: number
  interestRecapitalized: number
  interestCollected: number
  brite: number
  britePartial: number
}
