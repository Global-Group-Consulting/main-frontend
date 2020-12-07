import Vue from 'vue'
import moment from 'moment'
import Cleave from 'cleave.js'

import {capitalize, kebabCase} from "lodash"

class BriteConverter {
  static toBrite(value) {
    if (!value) {
      return value
    }

    const numeralFormatter = new Cleave.NumeralFormatter()
    const numericValue = numeralFormatter.getRawValue(value.toString())

    console.log(numericValue, numericValue)

    return +numericValue * 2
  }

  static toEuro(value) {
    return +value / 2
  }
}

export function contractNumberFormatter(value) {
  if (!value) {
    return ''
  }

  let finalValue = value.toString()

  while (finalValue.length < 6) {
    finalValue = '0' + finalValue
  }

  return finalValue
}

export function numberCasting(value) {
  if (!Number.isNaN(+value)) {
    return +value
  }

  return value
}

export function percentageFormatter(value) {
  return value
}

export function dateFormatter(value, includeHours) {
  if (!value) {
    return ''
  }

  if (!isNaN(Number(value))) {
    return moment(Number(value)).format('L' + (includeHours ? ' LT' : ''))
  }

  return moment(value).format('L' + (includeHours ? ' LT' : ''))
}

export function dateHourFormatter(value) {
  return dateFormatter(value, true)
}

export function datePickerFormatter(value) {
  if (!value) {
    return ''
  }

  if (!isNaN(Number(value))) {
    return moment(Number(value)).format('YYYY-MM-DD')
  }

  return moment(value).format('YYYY-MM-DD')
}

export function moneyFormatter(value, formatBrite = false) {
  if (!["string", "number"].includes(typeof value)) {
    return ''
  }

  if (value.toString().indexOf(",") > -1) {
    value = value.toString().replace(/\./g, '')
  } else {
    value = value.toString().replace(/\./g, ',')
  }

  // remove all non numeric values
  value = value.replace(/[^.,0-9]/g, "")

  if (!value) {
    return ""
  }

  // debugger
  const numeralFormatter = new Cleave.NumeralFormatter()
  numeralFormatter.delimiter = '.'
  numeralFormatter.numeralDecimalScale = !formatBrite ? 2 : 0
  numeralFormatter.numeralPositiveOnly = true
  numeralFormatter.numeralDecimalMark = ','

  let formatted = numeralFormatter.format(value)
  let decimals = formatted.split(',')[1] || ''

  while (decimals.length < numeralFormatter.numeralDecimalScale) {
    decimals += '0'
  }

  return formatted.split(',')[0] + (decimals ? ',' + decimals : '')
}

export function regionFormatter(value, list) {
  const region = list.find(_region => _region.value === value)

  return region?.text || value
}

export function userFormatter(user) {
  return `${capitalize(user.lastName)} ${capitalize(user.firstName)}`
}

export function formFieldNameFormatter(field) {
  return kebabCase(field)
}

Vue.filter('dateFormatter', dateFormatter)
Vue.filter('dateHourFormatter', dateHourFormatter)
Vue.filter('datePickerFormatter', datePickerFormatter)
Vue.filter('moneyFormatter', moneyFormatter)
Vue.filter('percentageFormatter', percentageFormatter)
Vue.filter('contractNumberFormatter', contractNumberFormatter)
Vue.filter('regionFormatter', regionFormatter)
Vue.filter('numberCasting', numberCasting)
Vue.filter('userFormatter', userFormatter)
Vue.filter('formFieldNameFormatter', formFieldNameFormatter)
