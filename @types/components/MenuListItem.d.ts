export interface MenuListItem {
  value?: string,
  id?: string
  action?: (menuItem: any) => void
  if?: boolean
  divider?: boolean
}
