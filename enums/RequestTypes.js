import { BasicEnum } from '@/classes/BasicEnum'

class RequestTypes extends BasicEnum {
  constructor () {
    super('RequestTypes')

    // this.ADMIN = 1
    this.VERSAMENTO = 2
    this.RISC_CAPITALE = 3
    this.RISC_INTERESSI = 4
    this.INTERESSI = 5

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
      [this.INTERESSI]: {
        id: 'interessi',
      }
    }
  }
}

export default new RequestTypes()
