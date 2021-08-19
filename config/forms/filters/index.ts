export type FiltersSchemasType =
  "usersFiltersSchema"
  | "requestsFiltersSchema"
  | "clubUsersFiltersSchema"
  | "reportsFiltersSchema"

import usersFiltersSchema from "./usersFiltersSchema"
import requestsFiltersSchema from "./requestsFiltersSchema"
import clubFiltersSchema from "./clubFiltersSchema"
import reportsFiltersSchema from "./reportsFiltersSchema"


export const schemas: any = {
  usersFiltersSchema,
  requestsFiltersSchema,
  clubFiltersSchema,
  reportsFiltersSchema
}
