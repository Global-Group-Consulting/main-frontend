import { BasicEnum } from '../classes/BasicEnum'

class OtpTypes extends BasicEnum {
  constructor () {
    super()

    this.ACTIVATION_PHASES = 1

    this.data = {
      [this.ACTIVATION_PHASES]: {
        id: 'activation_phases'
      }
    }
  }
}


export default new OtpTypes()
