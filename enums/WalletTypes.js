import { BasicEnum } from '@/classes/BasicEnum'

class WalletTypes extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super('WalletTypes')

    // Capitale dell'utente
    this.DEPOSIT = 1

    // Provvigione dell'agente
    this.COMMISION = 2

    this.data = {
      [this.DEPOSIT]: {
        id: 'deposit',
      },
      [this.COMMISION]: {
        id: 'commision',
      }
    }
  }
}

/**
 * @export {{test: string}}
 */
export default new WalletTypes()
