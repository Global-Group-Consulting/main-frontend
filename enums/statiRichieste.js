import { BasicEnum } from '~/assets/enums/BasicEnum'

class StatiRichieste extends BasicEnum {
  constructor() {
    super()

    this.NUOVA = 1
    this.LAVORAZIONE = 2
    this.ACCETTATA = 3
    this.RIFIUTATA = 4

    this.data = {
      [this.NUOVA]: {
        id: 'nuova',
        text: 'Nuova'
      },
      [this.LAVORAZIONE]: {
        id: 'lavorazione',
        text: 'In Lavorazione'
      },
      [this.ACCETTATA]: {
        id: 'accettata',
        text: 'Accettata'
      },
      [this.RIFIUTATA]: {
        id: 'rifiutata',
        text: 'Rifiutata'
      }
    }
  }
}

export default new StatiRichieste()
