import CellComponents from "../../components/table/CellsTemplates"

export interface TableSchema {
  text: string
  value: string
  sortable?: boolean
  align?: string
  width?: string
  class?: string
  component?: keyof typeof CellComponents
}
