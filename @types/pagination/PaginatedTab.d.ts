import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { PaginationDto } from '~/@types/pagination/PaginationDto'

export interface PaginatedTab {
  id: any,
  title?: string
  data?: PaginatedResult | null,
  refRole?: any,
  customKey?: string|number,
  tableKey?: string,
  tableOptions?: any,
  loading?: boolean,
  paginationDto?: PaginationDto,
  lastFetch?: null | Date
  counter?: number,
  if?: boolean,
  closable?: boolean,
  color?: string,
  icon?: string,
}
