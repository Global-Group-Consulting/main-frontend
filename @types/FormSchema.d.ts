import { Formatters } from "./Formatters";

export interface FormSchema {
  if?: boolean | function,
  legend?: string,
  disableEditMode?: boolean,
  cols: {
    [key: string]: {
      component?: string,
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
