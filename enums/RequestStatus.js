import { BasicEnum } from '@/classes/BasicEnum'

class RequestStatus extends BasicEnum {
  constructor () {
    super('RequestStatus')

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

export default new RequestStatus()
