
export interface DashboardBlockAction {
  label: string
  action: () => void,
  disabled?: boolean
  if?: boolean
}

export interface DashboardBlockData {
  icon: string
  label: string
  value: number | string | null
  valueExtra?: string
  color: string
  active?: boolean
  actions: DashboardBlockAction[]
  childs?: any[]
}
