import {Formatters} from "./Formatters";
import CurrencyType from "~/enums/CurrencyType";

export interface FormSchema {
  if?: boolean | Function,
  legend?: string,
  disableEditMode?: boolean,
  class?: string,
  maxCols?: number,
  colsBreakpoints?: Record<"cols" | "sm" | "md" | "lg", string>
  cols: {
    [key: string]: {
      component?: "v-select" | "date-picker" | "file-uploader"
        | "agent-commissions-select" | "contract-doc" | "money-input" | "phone-input"
        | "v-switch" | "v-autocomplete" | "v-textarea" | "",
      label?: string,
      formatter?: Formatters | Function,
      if?: any,
      items?: Function | any;
      disabled?: boolean | Function;
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
      validations?: {
        [key: string]: {
          params?: any
        }
      }
    }
  }
}
