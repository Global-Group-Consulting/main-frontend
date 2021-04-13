import {BasicEnum} from '@/classes/BasicEnum'

class RequestStatus extends BasicEnum {
  constructor() {
    super('RequestStatus')

    this.NUOVA = 1
    this.LAVORAZIONE = 2
    this.ACCETTATA = 3
    this.RIFIUTATA = 4
    this.ANNULLATA = 5

    this.data = {
      [this.NUOVA]: {
        id: 'nuova',
        color: "#0088ff"
      },
      [this.LAVORAZIONE]: {
        id: 'lavorazione',
        color: "#fb8c00"
      },
      [this.ACCETTATA]: {
        id: 'accettata',
        text: 'Accettata'
      },
      [this.RIFIUTATA]: {
        id: 'rifiutata',
        text: 'Rifiutata'
      },
      [this.ANNULLATA]: {
        id: 'annullata',
      }
    }
  }
}

export default new RequestStatus()
