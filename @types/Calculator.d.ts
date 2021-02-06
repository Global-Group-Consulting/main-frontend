import {Moment} from "moment";

export interface Movement {
  id: number
  date: Moment
  type: number
  amount: number
}

export interface QuotationEntry {
  date: Moment
  depositAdded: number
  depositCurrent: number
  depositCollected: number
  interestAmount: number
  interestRecapitalized: number
  interestCollected: number
  brite: number
}
