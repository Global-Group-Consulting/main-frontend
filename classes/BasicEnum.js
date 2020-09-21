class BasicEnum {
  constructor (enumName) {
    /**
     * @type {Object.<string, {index: number, id: string, text: string}>}
     */
    this.data = {}

    this.enumName = enumName
  }

  /**
   *
   * @param id
   * @returns {{index: *, id: string, text: string}|*}
   */
  get (id) {
    if (typeof id === 'number' || !isNaN(Number(id))) {
      return {
        index: id,
        ...this.data[id]
      }
    }

    let foundedEnum

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

  get iterable () {
    return Object.entries(this.data).reduce((acc, curr) => {
      const value = +curr[0]

      acc.push({
        value: Number.isNaN(value) ? curr[0] : value,
        ...curr[1]
      })

      return acc
    }, [])
  }

  get list () {
    return Object.entries(this.data).reduce((acc, curr) => {
      const value = +curr[0]

      if (!curr[1].hidden) {
        acc.push({
          value: Number.isNaN(value) ? curr[0] : value,
          text: curr[1].id
        })
      }

      return acc
    }, [])
  }
}

export { BasicEnum }
