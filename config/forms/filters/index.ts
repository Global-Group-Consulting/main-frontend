export type FiltersSchemasType =
  'usersFiltersSchema'
  | 'requestsFiltersSchema'
  | 'clubUsersFiltersSchema'
  | 'reportsFiltersSchema'
  | 'movementsFiltersSchema'

import usersFiltersSchema from './usersFiltersSchema'
import requestsFiltersSchema from './requestsFiltersSchema'
import clubFiltersSchema from './clubFiltersSchema'
import reportsFiltersSchema from './reportsFiltersSchema'
import movementsFiltersSchema from './movementsFiltersSchema'

export const schemas: any = {
  usersFiltersSchema,
  requestsFiltersSchema,
  clubFiltersSchema,
  reportsFiltersSchema,
  movementsFiltersSchema
}
