import { BasicEnum } from '../classes/BasicEnum'

class StatiFasiAttivazione extends BasicEnum {
  constructor() {
    super()

    // Usato solo la prima volta che l'utente viene creato
    this.DA_INIZIARE = 1

    // Stato di default delle nuove fasi
    this.IN_CORSO = 2

    // Completato in caso si sia passato ad una nuova fase
    this.COMPLETATA = 3

    // Solo nel caso in cui gli admin richiedono ulteriori dati all'utente
    this.DA_COMPLETARE = 4

    this.data = {
      [this.DA_INIZIARE]: {
        id: 'da_iniziare',
        text: 'Da iniziare'
      },
      [this.IN_CORSO]: {
        id: 'in_corso',
        text: 'In Corso'
      },
      [this.COMPLETATA]: {
        id: 'completa',
        text: 'Completata'
      },
      [this.DA_COMPLETARE]: {
        id: 'da_completare',
        text: 'Da Completare'
      }
    }
  }
}

export default new StatiFasiAttivazione()
