import { BasicEnum } from '../classes/BasicEnum'

class UserRoles extends BasicEnum {
  /**
   * @enum
   */
  constructor() {
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
        color: 'red accent-4',
        bgSrc: 'mb-bg-fb-18.png'
      },
      [this.ADMIN]: {
        id: 'admin',
        color: 'deep-purple',
        bgSrc: 'mb-bg-fb-02.jpg'
      },
      [this.SERV_CLIENTI]: {
        id: 'servClienti',
        color: 'purple',
        bgSrc: 'mb-bg-fb-08.png'
      },
      [this.AGENTE]: {
        id: 'agente',
        color: 'red darken-2',
        bgSrc: 'mb-bg-fb-15.png'
      },
      [this.CLIENTE]: {
        id: 'cliente',
        color: 'yellow darken-3',
        bgSrc: 'mb-bg-fb-20.png'
      }
    }
  }
}

export default new UserRoles()
