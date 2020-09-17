import * as Validators from 'vuelidate/lib/validators'

export const validationRules = schema => {
  const toReturn = {}

  for (const { cols } of schema) {
    const rulesToReturn = Object.keys(cols).reduce((rules, elementName) => {
      const item = cols[elementName]

      if (!item.hasOwnProperty('validations')) return rules

      const validations = {}
      for (let rule in item.validations) {
        const params = item.validations[rule].params

        if (params) {
          validations[rule] = Validators[rule](params)
        } else {
          validations[rule] = Validators[rule]
        }
      }

      rules[elementName] = validations
      return rules
    }, {})

    Object.assign(toReturn, rulesToReturn)
  }

  return toReturn
}

export function errorMessages () {
  const validations = this.$v.form

  return Object.keys(validations.$params).reduce((messages, key) => {
    const rules     = validations[key].$params
    const rulesKeys = Object.keys(rules)
    const validator = validations[key]

    if (!validator) return messages

    for (let rule of rulesKeys) {
      if (validator[rule] !== false || !validator.$dirty) continue

      messages[key] = this.$t('validators.' + rule)
      return messages
    }

    return messages
  }, {})
}
