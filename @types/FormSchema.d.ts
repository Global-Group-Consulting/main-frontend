import {Formatters} from "./Formatters";
import CurrencyType from "~/enums/CurrencyType";

type ValidatorRules = "required" |
  "requiredIf" |
  "requiredUnless" |
  "minLength" |
  "maxLength" |
  "minValue" |
  "maxValue" |
  "between" |
  "alpha" |
  "alphaNum" |
  "numeric" |
  "integer" |
  "decimal" |
  "email" |
  "ipAddress" |
  "macAddress" |
  "sameAs" |
  "url" |
  "not" |
  "or" |
  "and" | "phoneNumber"

export type FormSchemaValidations = Partial<Record<ValidatorRules, {
  params?: any
}>>

export interface FormSchemaField {
  component?: "v-select" | "date-picker" | "file-uploader"
    | "agent-commissions-select" | "contract-doc" | "money-input" | "phone-input"
    | "v-switch" | "v-autocomplete" | "v-textarea" | "",
  label?: string,
  formatter?: Formatters | Function,
  if?: any,
  items?: Function | any
  disabled?: boolean | Function
  hideDetails?: boolean
  falseValue?: boolean
  inputValue?: string | number | boolean
  type?: string
  files?: any[],
  clearable?: boolean,
  multiple?: boolean,
  max?: string | number,
  min?: string | number,
  showBrite?: boolean,
  onlyBrite?: boolean,
  currency?: number,
  autoGrow?: boolean,
  rows?: number,
  validations?: FormSchemaValidations
}

export interface FormSchema {
  if?: boolean | Function,
  legend?: string,
  disableEditMode?: boolean,
  class?: string,
  maxCols?: number,
  colsBreakpoints?: Record<"cols" | "sm" | "md" | "lg", string>
  cols: {
    [key: string]: FormSchemaField
  }
}
