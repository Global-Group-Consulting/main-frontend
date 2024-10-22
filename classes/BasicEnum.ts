import { SelectOption } from '~/@types/components/SelectInput'

export interface EnumData {
  id: string,
  index?: number | string,
  text?: string,
  symbol?: string,
  color?: string
  iconColor?: string
  bgSrc?: string
  hidden?: boolean
  order?: number
  reqRoles?: number[]
}

class BasicEnum {
  private enumName: string
  protected data: Record<any, EnumData> = {}
  
  constructor (enumName: string) {
    this.enumName = enumName
  }
  
  formatListText (value: any, data: EnumData): string {
    return value
  }
  
  get (id: any): EnumData {
    if (typeof id === 'number' || !isNaN(Number(id))) {
      return {
        index: id,
        ...this.data[id]
      }
    }
    
    let foundedEnum: EnumData = {
      id: ''
    }

    Object.entries(this.data).forEach(function (entry) {
      if (entry[1].id === id) {
        foundedEnum = {
          index: entry[0],
          ...entry[1]
        }
      }
    })

    return foundedEnum
  }

  getIdName(id: string | number): string | number {
    return this.get(id).id
  }

  get iterable(): Partial<EnumData & { value?: string | number }>[] {
    return Object.entries(this.data).reduce<Partial<EnumData & { value?: string | number }>[]>((acc, curr) => {
      const value: any = +curr[0]

      acc.push({
        value: Number.isNaN(value) ? curr[0] : value,
        ...curr[1]
      })

      return acc
    }, [])
  }


  get list(): SelectOption[] {
    return Object.entries(this.data).reduce<{ value: number | string, text: string }[]>((acc, curr) => {
      const value = +curr[0]
      
      if (!curr[1].hidden) {
        acc.push({
          value: Number.isNaN(value) ? curr[0] : value,
          text: this.formatListText(curr[1].id, curr[1])
        })
      }

      return acc
    }, [])
  }
}

export {BasicEnum}
