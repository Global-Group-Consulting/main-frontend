export interface ActionItemOptions {
  text?: boolean
}

export interface ActionItem {
  text: string
  tooltip?: string
  position?: "left" | "center" | "right"
  icon?: string
  options?: ActionItemOptions

  click(): void
}
