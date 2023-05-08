import {BasicEnum} from "~/classes/BasicEnum";

class CurrencyType extends BasicEnum {
  public EURO = 1
  public BRITE = 2
  public GOLD = 3
  public CRYPTO = 4

  constructor() {
    super('CurrencyType')

    this.data = {
      [this.EURO]: {
        id: 'euro',
        symbol: '€'
      },
      [this.BRITE]: {
        id: 'brite',
        symbol: 'Br\''
      },
      [this.GOLD]: {
        id: 'gold',
        symbol: 'Au'
      },
      [this.CRYPTO]: {
        id: 'crypto',
        symbol: '€'
      }
    }
  }
}

export default new CurrencyType()
