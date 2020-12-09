import {BasicEnum} from '../classes/BasicEnum'

/** @enum */
class AccountStatuses extends BasicEnum {
  /** @enum */
  constructor() {
    super('AccountStatuses')

    this.NEW_DEPOSIT = "newDeposit"
    this.TOTAL_DEPOSIT = "totalDeposit"
    this.ANNUAL_DEPOSIT = "annualDeposit"
    this.COMMISSIONS_REINVESTMENT = "commissionsReinvestment"
    this.COMMISSIONS_COLLECTED = "commissionsCollected"
    this.CANCEL_COMMISSIONS_COLLECTED = "cancelCommissionsCollected"

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
      }
    }
  }
}

export default new AccountStatuses()
