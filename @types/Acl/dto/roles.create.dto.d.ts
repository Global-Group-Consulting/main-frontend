import {AclPermission} from "../Permissions";

export interface RolesCreateDto {
  code: string
  description: string
  permissions: Pick<AclPermission, "code">[]
}
