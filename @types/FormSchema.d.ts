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
      formatter?: Formatters | Function,
      if?: any,
      items?: Function | any;
      disabled?: boolean | Function;
      type?: string
      files?: any[],
      clearable?: boolean,
      max?: string | number,
      min?: string | number,
      validations?: {
        [key: string]: {
          params?: any
        }
      }
    }
  }
}
