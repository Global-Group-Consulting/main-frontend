export interface ColumnSchema {
  text: string
  value: string
  align?: string
  sortable?: boolean
  divider?: boolean
}

export type ColumnSchemaList<T> = Record<keyof T, ColumnSchema>
