import {BasicEnum} from '../classes/BasicEnum'

/**
 * @enum
 */
class SettingTypes extends BasicEnum {
  // this.ADMIN = 1
  public GLOBAL = "global"
  public USER = "user"

  constructor() {
    super('SettingTypes')

    this.data = {
      [this.GLOBAL]: {
        id: 'global',
      },
      [this.USER]: {
        id: 'user',
      }
    }
  }
}

export default new SettingTypes()
