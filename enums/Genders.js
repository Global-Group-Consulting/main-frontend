import { BasicEnum } from '@/classes/BasicEnum'

class Genders extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super('Genders')

    this.MASCHIO = 'm'
    this.FEMMINA = 'f'

    this.data = {
      [this.MASCHIO]: {
        id: 'm',
        text: 'Maschio'
      },
      [this.FEMMINA]: {
        id: 'f',
        text: 'Femmina'
      },
    }
  }
}

export default new Genders()
