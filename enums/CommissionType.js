import {BasicEnum} from '../classes/BasicEnum'

/** @enum */
class AccountStatuses extends BasicEnum {
  /** @enum */
  constructor() {
    super('AccountStatuses')

    this.NEW_DEPOSIT = "newDeposit"
    this.TOTAL_DEPOSIT = "totalDeposit"
    this.ANNUAL_DEPOSIT = "annualDeposit"

    this.data = {
      [this.NEW_DEPOSIT]: {
        id: "newDeposit",
      },
      [this.TOTAL_DEPOSIT]: {
        id: "totalDeposit",
      },
      [this.ANNUAL_DEPOSIT]: {
        id: "annualDeposit",
      }
    }
  }
}

export default new AccountStatuses()
