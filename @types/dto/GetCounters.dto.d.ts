import { AclUserRoles } from '~/enums/AclUserRoles'

export interface GetCountersDto {
  _id: AclUserRoles,
  count: number
}
