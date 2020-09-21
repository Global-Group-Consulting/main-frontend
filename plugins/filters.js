import Vue from 'vue'
import moment from 'moment'
import Cleave from 'cleave.js'

export function contractNumberFormatter (value) {
  if (!value) {
    return ''
  }

  let finalValue = value.toString()

  while (finalValue.length < 6) {
    finalValue = '0' + finalValue
  }

  return finalValue
}

export function dateFormatter (value, includeHours) {
  if (!value) {
    return ''
  }

  if (!isNaN(Number(value))) {
    return moment(Number(value)).format('L' + (includeHours ? ' LT' : ''))
  }

  return moment(value).format('L' + (includeHours ? ' LT' : ''))
}

export function dateHourFormatter (value) {
  return dateFormatter(value, true)
}

export function datePickerFormatter (value) {
  if (!value) {
    return ''
  }

  if (!isNaN(Number(value))) {
    return moment(Number(value)).format('YYYY-MM-DD')
  }

  return moment(value).format('YYYY-MM-DD')
}

export function moneyFormatter (value) {
  if (!value) {
    return ''
  }

  value = value.toString().replace(/\./g, ',')

  const numeralFormatter = new Cleave.NumeralFormatter()
  numeralFormatter.delimiter = '.'
  numeralFormatter.numeralDecimalScale = 2
  numeralFormatter.numeralPositiveOnly = true
  numeralFormatter.numeralDecimalMark = ','
  numeralFormatter.prefix = '€ '

  let formatted = numeralFormatter.format(value)

  let decimals = formatted.split(',')[1] || ''

  while (decimals.length < 2) {
    decimals += '0'
  }

  return formatted.split(',')[0] + ',' + decimals
}

export function regionFormatter (value, list) {
  const region = list.find(_region => _region.value === value)

  return region?.text || value
}

Vue.filter('dateFormatter', dateFormatter)
Vue.filter('dateHourFormatter', dateHourFormatter)
Vue.filter('datePickerFormatter', datePickerFormatter)
Vue.filter('moneyFormatter', moneyFormatter)
Vue.filter('contractNumberFormatter', contractNumberFormatter)
Vue.filter('regionFormatter', regionFormatter)
