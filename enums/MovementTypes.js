import { BasicEnum } from '../classes/BasicEnum'

class MovementTypes extends BasicEnum {
  
  constructor () {
    super('MovementTypes')
    
    this.INITIAL_DEPOSIT = 1
    this.DEPOSIT_ADDED = 2
    this.INTEREST_RECAPITALIZED = 3
    // Prelievi
    this.INTEREST_COLLECTED = 4
    this.DEPOSIT_COLLECTED = 5
    this.COMMISSION_COLLECTED = 6
    this.MANUAL_INTEREST_COLLECTED = 12
    
    // Storno operazioni
    this.CANCEL_INTEREST_COLLECTED = 7
    this.CANCEL_DEPOSIT_COLLECTED = 8
    this.CANCEL_COMMISSION_COLLECTED = 9
    this.CANCEL_DEPOSIT_ADDED = 11
    
    this.COMMISSIONS_REINVESTMENT = 10
    
    this.DEPOSIT_REPAYMENT = 13
  
    this.IN_MOVEMENT_TYPES = [
      this.INITIAL_DEPOSIT,
      this.DEPOSIT_ADDED,
      this.INTEREST_RECAPITALIZED,
      this.DEPOSIT_REPAYMENT,
      this.CANCEL_INTEREST_COLLECTED,
      this.CANCEL_DEPOSIT_COLLECTED,
      this.CANCEL_COMMISSION_COLLECTED,
      this.COMMISSIONS_REINVESTMENT
    ]
  
    this.IN_DEPOSIT_TYPES = [
      this.INITIAL_DEPOSIT,
      this.DEPOSIT_ADDED,
      this.INTEREST_RECAPITALIZED,
      this.DEPOSIT_REPAYMENT,
      this.CANCEL_DEPOSIT_COLLECTED,
      this.COMMISSIONS_REINVESTMENT
    ]
  
    this.IN_INTEREST_TYPES = [
      this.CANCEL_INTEREST_COLLECTED
    ]
  
    this.OUT_MOVEMENT_TYPES = [
      this.INTEREST_COLLECTED,
      this.DEPOSIT_COLLECTED,
      this.COMMISSION_COLLECTED,
      this.MANUAL_INTEREST_COLLECTED,
      this.CANCEL_DEPOSIT_ADDED
    ]
  
    this.OUT_DEPOSIT_TYPES = [
      this.DEPOSIT_COLLECTED,
      this.CANCEL_DEPOSIT_ADDED
    ]
  
    this.OUT_INTEREST_TYPES = [
      this.INTEREST_COLLECTED,
      this.MANUAL_INTEREST_COLLECTED
    ]
    
    super.data = {
      [this.INITIAL_DEPOSIT]: {
        id: 'initialDeposit'
      },
      [this.DEPOSIT_ADDED]: {
        id: 'depositAdded'
      },
      [this.INTEREST_RECAPITALIZED]: {
        id: 'interestRecapitalized'
      },
      [this.INTEREST_COLLECTED]: {
        id: 'interestCollected',
        cancel: this.CANCEL_INTEREST_COLLECTED
      },
      [this.DEPOSIT_COLLECTED]: {
        id: 'depositCollected',
        cancel: this.CANCEL_DEPOSIT_COLLECTED
      },
      [this.COMMISSION_COLLECTED]: {
        if: 'commissionCollected',
        cancel: this.CANCEL_COMMISSION_COLLECTED
      },
      [this.CANCEL_INTEREST_COLLECTED]: {
        id: 'cancelInterestCollected'
      },
      [this.CANCEL_DEPOSIT_COLLECTED]: {
        id: 'cancelDepositCollected'
      },
      [this.CANCEL_COMMISSION_COLLECTED]: {
        id: 'cancelCommissionCollected'
      },
      [this.COMMISSIONS_REINVESTMENT]: {
        id: 'commissionsReinvestment'
      },
      [this.CANCEL_DEPOSIT_ADDED]: {
        id: 'cancelDepositAdded'
      },
      [this.MANUAL_INTEREST_COLLECTED]: {
        id: 'manualInterestCollected'
      },
      [this.DEPOSIT_REPAYMENT]: {
        id: 'depositRepayment'
      }
    }
  }
}

export default new MovementTypes()
