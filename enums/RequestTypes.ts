import {BasicEnum, EnumData} from '../classes/BasicEnum'
import UserRoles from "~/enums/UserRoles";


/**
 * @enum
 */
class RequestTypes extends BasicEnum {
  // this.ADMIN = 1
  public VERSAMENTO = 2;
  // tippologia creata solo a livello visivo, ma non viene usata nel codice o nelle richieste
  public VERSAMENTO_INIZIALE = 11;

  public RISC_CAPITALE = 3;

  public RISC_INTERESSI = 4;
  public RISC_INTERESSI_GOLD = 6;
  public RISC_INTERESSI_BRITE = 7;
  public RISC_MANUALE_INTERESSI = 10;

  // Reinvestimento Interessi maturati da un agente
  public RISC_PROVVIGIONI = 5;

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
        order: 1,
      },
      [this.VERSAMENTO_INIZIALE]: {
        id: 'versamento_iniziale',
        reqRoles: [UserRoles.AGENTE, UserRoles.ADMIN, UserRoles.SERV_CLIENTI],
        order: 2,
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
        reqRoles: [UserRoles.AGENTE, UserRoles.ADMIN, UserRoles.SERV_CLIENTI]
      },
      [this.RISC_INTERESSI_GOLD]: {
        id: 'risc_interessi_gold',
      },
      [this.RISC_INTERESSI_BRITE]: {
        id: 'risc_interessi_brite',
      },
      [this.COMMISSION_MANUAL_ADD]: {
        id: 'commission_manual_add',
        reqRoles: [UserRoles.AGENTE, UserRoles.ADMIN, UserRoles.SERV_CLIENTI]
      },
      [this.COMMISSION_MANUAL_TRANSFER]: {
        id: 'commission_manual_transfer',
        reqRoles: [UserRoles.AGENTE, UserRoles.ADMIN, UserRoles.SERV_CLIENTI]
      },
      [this.RISC_MANUALE_INTERESSI]: {
        id: 'risc_manuale_interessi',
        reqRoles: [UserRoles.ADMIN]
      }
    }
  }
}

export default new RequestTypes()
