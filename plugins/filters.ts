import Vue from 'vue'
import moment from 'moment-timezone'
// @ts-ignore
import * as Cleave from 'cleave.js/src/Cleave';

import {capitalize, kebabCase, upperFirst as _upperFirst} from "lodash"
import {moneyFormatter} from "~/plugins/filters/moneyFormatter";
import {Plugin} from "@nuxt/types";


const workingTimezone = "Europe/Rome";

export function contractNumberFormatter(value: any) {
  if (!value) {
    return ''
  }

  let finalValue = value.toString()

  while (finalValue.length < 6) {
    finalValue = '0' + finalValue
  }

  return finalValue
}

export function numberCasting(value: any) {
  if (!Number.isNaN(+value)) {
    return +value
  }

  return value
}

export function percentageFormatter(value: any) {
  return value
}

export function dateFormatter(value: any, includeHours?: boolean, humanFormat?: any) {
  if (!value) {
    return ''
  }

  let momentDate
  let format
  let toReturn

  if (!isNaN(Number(value))) {
    momentDate = moment(Number(value))
    format = 'L' + (includeHours ? ' LT' : '')
  } else {
    momentDate = moment(value)
    format = 'L' + (includeHours ? ' LT' : '')
  }

  if (humanFormat && momentDate.isSameOrAfter(moment().subtract(2, "days"))) {
    toReturn = momentDate.tz(workingTimezone).fromNow()
  } else {
    toReturn = momentDate.tz(workingTimezone).format(format)
  }

  return toReturn
}

export function dateHourFormatter(value: any, humanFormat: any) {
  return dateFormatter(value, true, humanFormat)
}

export function datePickerFormatter(value: any) {
  if (!value) {
    return ''
  }
  

  if (!isNaN(Number(value))) {
    return moment(Number(value)).tz(workingTimezone).format('YYYY-MM-DD')
  }

  return moment(value).tz(workingTimezone).format('YYYY-MM-DD')
}

/*
export function moneyFormatter(value, formatBrite = false, avoidNull = false) {
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

  if (formatted === "0" && avoidNull) {
    return ""
  }

  return formatted.split(',')[0] + (decimals ? ',' + decimals : '')
}*/


export function moneyParser(value: any) {
  if (typeof value === "number") {
    return value
  }

  const numeralFormatter = new Cleave.NumeralFormatter()
  numeralFormatter.delimiter = '.'
  numeralFormatter.numeralPositiveOnly = true
  numeralFormatter.numeralDecimalMark = ','

  return numeralFormatter.format(value)
}

export function regionFormatter(value: any, list: any) {
  const region = list.find((_region: any) => _region.value === value)

  return region && region.text ? region.text : value;
}

export function userFormatter(user: any) {
  if (!user) {
    return ""
  }

  return `${capitalize(user.lastName)} ${capitalize(user.firstName)}`
}

export function formFieldNameFormatter(field: any) {
  return kebabCase(field)
}

export function upperFirst(value: any) {
  return _upperFirst(value)
}

export {moneyFormatter}

Vue.filter('dateFormatter', dateFormatter)
Vue.filter('dateHourFormatter', dateHourFormatter)
Vue.filter('datePickerFormatter', datePickerFormatter)
Vue.filter('moneyFormatter', moneyFormatter)
Vue.filter('moneyParser', moneyParser)
Vue.filter('percentageFormatter', percentageFormatter)
Vue.filter('contractNumberFormatter', contractNumberFormatter)
Vue.filter('regionFormatter', regionFormatter)
Vue.filter('numberCasting', numberCasting)
Vue.filter('userFormatter', userFormatter)
Vue.filter('formFieldNameFormatter', formFieldNameFormatter)
Vue.filter('upperFirst', upperFirst)
