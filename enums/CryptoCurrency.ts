import { SelectOption } from '~/@types/components/SelectInput'
import { BasicEnum, EnumData } from '~/classes/BasicEnum'

class CryptoCurrency extends BasicEnum {
  public BITCOIN = 'BTC'
  public ETHEREUM = 'ETH'
  public LITECOIN = 'LTC'
  public DOGECOIN = 'DOGE'
  public XRP = 'XRP'
  public CARDANO = 'ADA'
  
  constructor () {
    super('CryptoCurrency')
    
    this.data = {
      [this.BITCOIN]: {
        id: 'BTC',
        text: 'Bitcoin',
        symbol: '₿'
      },
      [this.ETHEREUM]: {
        id: 'ETH',
        text: 'Ethereum',
        symbol: 'Ξ'
      },
      [this.LITECOIN]: {
        id: 'LTC',
        text: 'Litecoin',
        symbol: 'Ł'
      },
      [this.DOGECOIN]: {
        id: 'DOGE',
        text: 'Dogecoin',
        symbol: 'Ð'
      },
      [this.XRP]: {
        id: 'XRP',
        text: 'XRP',
        symbol: 'X'
      },
      [this.CARDANO]: {
        id: 'ADA',
        text: 'Cardano',
        symbol: '₳'
      }
    }
  }
  
  formatListText (value: string, data: EnumData): string {
    return data.text + ` (${data.id})`
  }
}

/*

export const CryptoCurrencySelectOptions: SelectOption[] = Object.values(CryptoCurrency).map((currency) => ({
  text: currency.name + ` (${currency.acronym})`,
  value: currency.acronym
}))
*/
export default new CryptoCurrency()
