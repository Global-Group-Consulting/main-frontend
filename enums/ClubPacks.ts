import {BasicEnum} from '~/classes/BasicEnum'

/** @enum */
class ClubPacks extends BasicEnum {
  public UNSUBSCRIBED = "unsubscribed"
  public BASIC = "basic"
  public FAST = "fast"
  public PREMIUM = "premium"

  constructor() {
    super('ClubPacks')

    this.data = {
      [this.UNSUBSCRIBED]: {
        id: "unsubscribed",
        color: "#c6c6c6",
      },
      [this.BASIC]: {
        id: "basic",
        color: "#F9FBE7",
      },
      [this.FAST]: {
        id: "fast",
        color: "#FFF176",
      },
      [this.PREMIUM]: {
        id: "premium",
        color: "#F9A825",
      }
    }
  }
}

export default new ClubPacks()
