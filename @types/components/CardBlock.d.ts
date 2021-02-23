export interface CardBlockI {
  id: string
  color?: string
  icon?: string
  value?: string | ((card: any, tab: any) => string)
  title?: string | any
  action?: (data: any) => void | null
  actionText?: string | any
  actionDisabled?: ((card?: any, tab?: any) => boolean) | boolean
}
