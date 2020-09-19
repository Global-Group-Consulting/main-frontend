import { BasicEnum } from '@/classes/BasicEnum'

class DocumentTypes extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super("DocumentTypes")

    this.GENERICO     = 1
    this.DOC_IDENTITA = 2
    this.PATENTE      = 3
    this.PASSAPORTO   = 4
    this.CONTABILE    = 5

    this.data = {
      [this.GENERICO]:     {
        id:  'generico',
        cat: 'generic'
      },
      [this.DOC_IDENTITA]: {
        id:  'doc_identita',
        cat: 'identity'
      },
      [this.PATENTE]:      {
        id:  'patente',
        cat: 'identity'
      },
      [this.PASSAPORTO]:   {
        id:  'passaporto',
        cat: 'identity'
      },
      [this.CONTABILE]:    {
        id:  'contabile',
        cat: 'payments'
      }
    }
  }
}

export default new DocumentTypes()
