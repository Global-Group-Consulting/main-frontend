import { BasicEnum } from '../classes/BasicEnum'

class StatiEmail extends BasicEnum {
  constructor() {
    super()

    this.IN_USCITA = 1
    this.INVIATA = 2
    this.ERRORE = 3

    this.data = {
      [this.IN_USCITA]: {
        id: 'in_uscita',
        text: 'In uscita'
      },
      [this.INVIATA]: {
        id: 'inviata',
        text: 'Inviate'
      },
      [this.ERRORE]: {
        id: 'errore',
        text: 'Non inviate'
      }
    }
  }
}

export default new StatiEmail()
