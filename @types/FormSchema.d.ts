import { Formatters } from './Formatters'
import CurrencyType from '~/enums/CurrencyType'

type ValidatorRules = 'required' |
  'requiredIf' |
  'requiredUnless' |
  'minLength' |
  'maxLength' |
  'minValue' |
  'maxValue' |
  'minDate' |
  'between' |
  'alpha' |
  'alphaNum' |
  'numeric' |
  'integer' |
  'decimal' |
  'email' |
  'ipAddress' |
  'macAddress' |
  'sameAs' |
  'url' |
  'not' |
  'or' |
  'and' | 'phoneNumber'

export type FormSchemaValidations = Partial<Record<ValidatorRules, {
  params?: any
}>>

export interface FormSchemaField {
  component?: 'v-select' | 'date-picker' | 'date-picker-range' | 'time-picker' | 'time-picker-range' | 'file-uploader'
    | 'agent-commissions-select' | 'contract-doc' | 'money-input' | 'money-input-range' | 'phone-input'
    | 'v-switch' | 'v-autocomplete' | 'v-textarea' | 'rich-text-editor' | 'async-autocomplete' | '',
  label?: string,
  minLabel?: string,
  maxLabel?: string,
  formatter?: Formatters | Function,
  if?: any,
  items?: any
  asyncFn?: Function
  disabled?: boolean | Function
  readonly?: boolean | Function
  hideDetails?: boolean
  hint?: string
  persistentHint?: boolean
  falseValue?: boolean
  inputValue?: string | number | boolean
  defaultValue?: any
  type?: string
  files?: any[],
  previewOnly?: boolean,
  canCancel?: boolean,
  clearable?: boolean,
  multiple?: boolean,
  max?: string | number,
  maxValue?: string | number,
  min?: string | number,
  showBrite?: boolean,
  onlyBrite?: boolean,
  currency?: number,
  autoGrow?: boolean,
  range?: boolean,
  startByYear?: boolean,
  chipVersion?: boolean,
  rows?: number,
  accept?: string,
  selectableDates?: string[][],
  validations?: FormSchemaValidations
}

export interface FormSchema {
  if?: boolean | Function,
  legend?: string,
  disableEditMode?: boolean,
  class?: string,
  maxCols?: number,
  colsBreakpoints?: {
    cols?: string,
    sm?: string,
    md?: string,
    lg?: string,
  }
  cols: {
    [key: string]: FormSchemaField
  }
}
