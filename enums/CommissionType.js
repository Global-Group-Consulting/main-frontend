import {BasicEnum} from '../classes/BasicEnum'

/** @enum */
class CommissionType extends BasicEnum {
  /** @enum */
  constructor() {
    super('CommissionType')

    this.NEW_DEPOSIT = "newDeposit"
    this.TOTAL_DEPOSIT = "totalDeposit"
    this.ANNUAL_DEPOSIT = "annualDeposit"
    this.COMMISSIONS_REINVESTMENT = "commissionsReinvestment"
    this.COMMISSIONS_COLLECTED = "commissionsCollected"
    this.CANCEL_COMMISSIONS_COLLECTED = "cancelCommissionsCollected"

    //  Status used when the month end and i must block the months commissions, waiting for reinvestment date.
    this.COMMISSIONS_TO_REINVEST = "commissionsToReinvest"

    this.data = {
      [this.NEW_DEPOSIT]: {
        id: "newDeposit",
      },
      [this.TOTAL_DEPOSIT]: {
        id: "totalDeposit",
      },
      [this.ANNUAL_DEPOSIT]: {
        id: "annualDeposit",
      },
      [this.COMMISSIONS_REINVESTMENT]: {
        id: "commissionsReinvestment",
      },
      [this.COMMISSIONS_COLLECTED]: {
        id: "commissionsCollected",
      },
      [this.CANCEL_COMMISSIONS_COLLECTED]: {
        id: "cancelCommissionsCollected",
      },
      [this.COMMISSIONS_TO_REINVEST]: {
        id: "commissionsToReinvest",
      }
    }
  }
}

export default new CommissionType()
