import {AclPermission} from "./Permissions";

export interface AclRole {
  id: string
  code: string
  description: string
  permissions: Pick<AclPermission, "code">[]
  created_at: string
  updated_at: string
}

