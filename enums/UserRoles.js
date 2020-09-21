import { BasicEnum } from '@/classes/BasicEnum'

class UserRoles extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super('UserRoles')

    this.SUPER_ADMIN = 0
    this.ADMIN = 1
    this.SERV_CLIENTI = 2
    this.AGENTE = 3
    this.CLIENTE = 4

    this.data = {
      [this.SUPER_ADMIN]: {
        id: 'superAdmin',
        hidden: true,
        text: 'Super Admin',
        color: 'red accent-4',
        bgSrc: 'mb-bg-fb-18.png'
      },
      [this.ADMIN]: {
        id: 'admin',
        text: 'Amministratore',
        color: 'purple',
        bgSrc: 'mb-bg-fb-02.jpg'
      },
      [this.SERV_CLIENTI]: {
        id: 'servClienti',
        text: 'Servizio Clienti',
        color: 'teal',
        bgSrc: 'mb-bg-fb-08.png'
      },
      [this.AGENTE]: {
        id: 'agente',
        text: 'Agente',
        color: 'indigo',
        bgSrc: 'mb-bg-fb-15.png'
      },
      [this.CLIENTE]: {
        id: 'cliente',
        text: 'Cliente',
        color: 'grey',
        bgSrc: 'mb-bg-fb-20.png'
      }
    }
  }
}

export default new UserRoles()
