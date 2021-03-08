import {BasicEnum} from '../classes/BasicEnum'

/**
 * @enum
 */
class RequestTypes extends BasicEnum {
  constructor() {
    super('RequestTypes')

    // this.ADMIN = 1
    this.VERSAMENTO = 2
    this.RISC_CAPITALE = 3
    this.RISC_INTERESSI = 4

    // Reinvestimento Interessi maturati da un agente
    this.RISC_PROVVIGIONI = 5

    this.RISC_CAPITALE_GOLD = 6
    this.RISC_INTERESSI_BRITE = 7

    this.data = {
      /*  [this.ADMIN]: {
          id: 'admin',
          text: 'Admin'
        },*/
      [this.VERSAMENTO]: {
        id: 'versamento',
        text: 'Versamento'
      },
      [this.RISC_CAPITALE]: {
        id: 'risc_capitale',
        text: 'Riscossione capitale'
      },
      [this.RISC_INTERESSI]: {
        id: 'risc_interessi',
        text: 'Riscossione interessi'
      },
      // interessi maturati mensilmente
      [this.RISC_PROVVIGIONI]: {
        id: 'risc_provvigioni',
      },
      [this.RISC_CAPITALE_GOLD]: {
        id: 'risc_capitale_gold',
      },
      [this.RISC_INTERESSI_BRITE]: {
        id: 'risc_interessi_brite',
      }
    }
  }
}

export default new RequestTypes()
