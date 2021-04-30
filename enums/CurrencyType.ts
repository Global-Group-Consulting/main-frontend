import {BasicEnum} from "~/classes/BasicEnum";

class CurrencyType extends BasicEnum {
  public EURO = 1
  public BRITE = 2
  public GOLD = 3

  constructor() {
    super('CurrencyType')

    this.data = {
      [this.EURO]: {
        id: 'euro',
        symbol: '€'
      },
      [this.BRITE]: {
        id: 'brite',
        symbol: 'B'
      },
      [this.GOLD]: {
        id: 'gold',
        symbol: 'Au'
      },
    }
  }
}

export default new CurrencyType()
