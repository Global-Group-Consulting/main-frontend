export type FiltersSchemasType =
  'usersFiltersSchema'
  | 'requestsFiltersSchema'
  | 'clubUsersFiltersSchema'
  | 'reportsFiltersSchema'
  | 'movementsFiltersSchema'
  | 'calendarFiltersSchema'

import usersFiltersSchema from './usersFiltersSchema'
import requestsFiltersSchema from './requestsFiltersSchema'
import clubFiltersSchema from './clubFiltersSchema'
import reportsFiltersSchema from './reportsFiltersSchema'
import movementsFiltersSchema from './movementsFiltersSchema'
import calendarFiltersSchema from './calendarFiltersSchema'

export const schemas: any = {
  usersFiltersSchema,
  requestsFiltersSchema,
  clubFiltersSchema,
  reportsFiltersSchema,
  movementsFiltersSchema,
  calendarFiltersSchema,
}
