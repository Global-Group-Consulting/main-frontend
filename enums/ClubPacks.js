import {BasicEnum} from '../classes/BasicEnum'

/** @enum */
class ClubPacks extends BasicEnum {
  constructor() {
    super('ClubPacks')

    this.BASIC = "basic"
    this.FAST = "fast"
    this.PREMIUM = "premium"

    this.data = {
      [this.BASIC]: {
        id: "basic",
        color: "#4eff26",
      },
      [this.FAST]: {
        id: "fast",
        color: "#e9ff26",
      },
      [this.PREMIUM]: {
        id: "premium",
        color: "#FFA726",
      }
    }
  }
}

export default new ClubPacks()
