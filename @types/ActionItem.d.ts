import { ComputedRef } from '@vue/composition-api'

export interface ActionItemOptions {
  text?: boolean,
  color?: string
}

export interface ActionItem {
  text: string
  html?: string
  tooltip?: string
  position?: 'left' | 'center' | 'right' | any
  icon?: string
  options?: ActionItemOptions
  disabled?: ComputedRef
  if?: ComputedRef | boolean
  loading?: boolean
  /**
   * Indicated if this element must be shown only in the mobile menu
   */
  onlyInMobile?: Boolean,
  onlyInDesktop?: Boolean,
  menuOptions?: {
    text: string
    icon?: string
    options?: ActionItemOptions
    click? (event: any, action: ActionItem): void
  }[]
  
  click? (event: any, action: ActionItem): void
}
