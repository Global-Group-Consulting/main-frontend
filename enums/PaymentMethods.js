import {BasicEnum} from '@/classes/BasicEnum'
/**
 * @enum
 */
class PaymentMethods extends BasicEnum {

  constructor() {
    super("PaymentMethods")

    this.BONIFICO = "bonifico"
    this.ASSEGNO = "assegno"
    this.ALTRO = "altro"

    this.data = {
      [this.BONIFICO]: {
        id: "bonifico"
      },
      [this.ASSEGNO]: {
        id: "assegno"
      },
      [this.ALTRO]: {
        id: "altro"
      }
    }
  }
}

export default new PaymentMethods()
