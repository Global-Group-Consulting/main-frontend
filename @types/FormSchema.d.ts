import { Formatters } from "./Formatters";

export interface FormSchema {
  if?: boolean | function,
  legend?: string,
  disableEditMode?: boolean,
  class?: string,
  maxCols?: number,
  cols: {
    [key: string]: {
      component?: string,
      label?: string,
      formatter?: Formatters,
      disabled?: boolean,
      if?: any,
      items?: [] | function
      disabled?: boolean | function
      type?: string
      files?: [],
      clearable?: boolean,
      validations?: {
        [key: string]: {
          params?: any
        }
      }
    }
  }
}
