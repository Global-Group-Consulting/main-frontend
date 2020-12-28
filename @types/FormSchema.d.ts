import {Formatters} from "./Formatters";

export interface FormSchema {
  if?: boolean | Function,
  legend?: string,
  disableEditMode?: boolean,
  class?: string,
  maxCols?: number,
  cols: {
    [key: string]: {
      component?: string,
      label?: string,
      formatter?: Formatters,
      if?: any,
      items?: [] | Function;
      disabled?: boolean | Function;
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
