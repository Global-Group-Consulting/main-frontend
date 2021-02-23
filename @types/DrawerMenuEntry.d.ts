
export interface DrawerMenuEntry {
  text: string | Function
  type?: string
  childs?: string[]
  id?: string
  icon?: string
  link?: string
  condition?: Function
}
