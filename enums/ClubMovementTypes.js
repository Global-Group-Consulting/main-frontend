import {BasicEnum} from '~/classes/BasicEnum'

/** @enum */
class ClubMovementTypes extends BasicEnum {
  constructor() {
    super('ClubMovementTypes')

    // Generated when recapitalization occurs
    this.INTEREST_RECAPITALIZED = "interest_recapitalized"

    // When added by admins
    this.DEPOSIT_ADDED = "deposit_added"

    // When a user transfers them to a user
    this.DEPOSIT_TRANSFERED = "deposit_transferred"

    // When a user uses them
    this.DEPOSIT_COLLECTED = "deposit_collected"

    this.data = {
      [this.INTEREST_RECAPITALIZED]: {
        id: this.INTEREST_RECAPITALIZED
      },
      [this.DEPOSIT_ADDED]: {
        id: this.DEPOSIT_ADDED
      },
      [this.DEPOSIT_TRANSFERED]: {
        id: this.DEPOSIT_TRANSFERED
      },
      [this.DEPOSIT_COLLECTED]: {
        id: this.DEPOSIT_COLLECTED
      },
    }
  }
}

export default new ClubMovementTypes()
