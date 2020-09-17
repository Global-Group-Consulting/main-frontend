import { BasicEnum } from '../classes/BasicEnum'

class TipiErrori extends BasicEnum {
  constructor () {
    super()

    this.GENERIC    = 1
    this.MONGODB    = 2
    this.HTTP       = 3
    this.VUE        = 4
    this.EMAIL      = 5
    this.VALIDATION = 6

    this.data = {
      [this.GENERIC]:    {
        id:    'generic',
        text:  'Errori Generici',
        color: 'yellow'
      },
      [this.MONGODB]:    {
        id:    'mongodb',
        text:  'Errori Mongo DB',
        color: 'green-light'
      },
      [this.HTTP]:       {
        id:    'http',
        text:  'Errori HTTP',
        color: 'blue'
      },
      [this.VUE]:        {
        id:    'vue',
        text:  'Errori Vue.js',
        color: 'green'
      },
      [this.EMAIL]:      {
        id:    'email',
        text:  'Errori Emails',
        color: 'red'
      },
      [this.VALIDATION]: {
        id:    'validation',
        text:  'Errori di Validazione',
        color: 'yellow'
      }
    }
  }
}

export default new TipiErrori()
