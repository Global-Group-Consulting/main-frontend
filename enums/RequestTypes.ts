import {BasicEnum} from '../classes/BasicEnum'

/**
 * @enum
 */
class RequestTypes extends BasicEnum {
  // this.ADMIN = 1
  public VERSAMENTO = 2;
  public RISC_CAPITALE = 3;
  public RISC_INTERESSI = 4;
  // Reinvestimento Interessi maturati da un agente
  public RISC_PROVVIGIONI = 5;
  public RISC_INTERESSI_GOLD = 6;
  public RISC_INTERESSI_BRITE = 7;
  public COMMISSION_MANUAL_ADD = 8;
  public COMMISSION_MANUAL_TRANSFER = 9;

  constructor() {
    super('RequestTypes')

    this.data = {
      /*  [this.ADMIN]: {
          id: 'admin',
          text: 'Admin'
        },*/
      [this.VERSAMENTO]: {
        id: 'versamento',
      },
      [this.RISC_CAPITALE]: {
        id: 'risc_capitale',
      },
      [this.RISC_INTERESSI]: {
        id: 'risc_interessi',
      },
      // interessi maturati mensilmente
      [this.RISC_PROVVIGIONI]: {
        id: 'risc_provvigioni',
      },
      [this.RISC_INTERESSI_GOLD]: {
        id: 'risc_interessi_gold',
      },
      [this.RISC_INTERESSI_BRITE]: {
        id: 'risc_interessi_brite',
      },
      [this.COMMISSION_MANUAL_ADD]: {
        id: 'commission_manual_add',
      },
      [this.COMMISSION_MANUAL_TRANSFER]: {
        id: 'commission_manual_transfer',
      }
    }
  }
}

export default new RequestTypes()
