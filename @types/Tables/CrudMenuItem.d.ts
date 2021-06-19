export interface CrudMenuItem {
  value: string
  icon?: string
  action?: (...args: any[]) => Promise<void | any>
  if?: boolean
  alwaysVisible?: boolean
  divider?: boolean
}
