import { BasicEnum } from '@/classes/BasicEnum'

class PersonTypes extends BasicEnum {
  /**
   * @enum
   */
  constructor() {
    super("PersonTypes")

    this.FISICA = 1
    this.GIURIDICA = 2

    this.data = {
      [this.FISICA]: {
        id: 'fisica',
        text: 'Persona Fisica'
      },
      [this.GIURIDICA]: {
        id: 'giuridica',
        text: 'Persona Giuridica'
      },
    }
  }
}

export default new PersonTypes()
