import {BasicEnum} from '~/classes/BasicEnum'

/** @enum */
class CommissionType extends BasicEnum {
  /** @enum */
  constructor() {
    super('CommissionType')

    this.NEW_DEPOSIT = "newDeposit"
    this.TOTAL_DEPOSIT = "totalDeposit"
    this.ANNUAL_DEPOSIT = "annualDeposit"
    this.MANUAL_ADD = "manualAdd"
    this.MANUAL_TRANSFER = "manualTransfer"
    this.MANUAL_TRANSFER_DONER = "manualTransferDoner"
    this.MANUAL_WITHDRAWAL = "manualWithdrawal"
    this.COMMISSIONS_REINVESTMENT = "commissionsReinvestment"
    this.COMMISSIONS_COLLECTED = "commissionsCollected"
    this.CANCEL_COMMISSIONS_COLLECTED = "cancelCommissionsCollected"

    //  Status used when the month end and i must block the months commissions, waiting for reinvestment date.
    this.COMMISSIONS_TO_REINVEST = "commissionsToReinvest"

    this.COMMISSIONS_CANCELLATION = "commissionsCancellation"

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
      [this.MANUAL_ADD]: {
        id: this.MANUAL_ADD,
      },
      [this.MANUAL_TRANSFER]: {
        id: this.MANUAL_TRANSFER,
      },
      [this.MANUAL_TRANSFER_DONER]: {
        id: this.MANUAL_TRANSFER_DONER,
      },
      [this.MANUAL_WITHDRAWAL]: {
        id: this.MANUAL_WITHDRAWAL,
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
      },
      [this.COMMISSIONS_CANCELLATION]: {
        id: this.COMMISSIONS_CANCELLATION,
      }
    }
  }
}

export default new CommissionType()
