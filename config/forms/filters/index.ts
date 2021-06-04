export type FiltersSchemasType = "usersFiltersSchema" | "requestsFiltersSchema" | "clubUsersFiltersSchema"

import usersFiltersSchema from "./usersFiltersSchema"
import requestsFiltersSchema from "./requestsFiltersSchema"
import clubFiltersSchema from "./clubFiltersSchema"


export const schemas: any = {
  usersFiltersSchema,
  requestsFiltersSchema,
  clubFiltersSchema
}
