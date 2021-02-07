import {ComputedRef} from "@vue/composition-api"

export interface ActionItemOptions {
  text?: boolean
}

export interface ActionItem {
  text: string
  tooltip?: string
  position?: "left" | "center" | "right"
  icon?: string
  options?: ActionItemOptions
  disabled?: ComputedRef
  if?: ComputedRef
  /**
   * Indicated if this element must be shown only in the mobile menu
   */
  onlyInMobile?: Boolean

  click?(event: any, action: ActionItem): void
}
