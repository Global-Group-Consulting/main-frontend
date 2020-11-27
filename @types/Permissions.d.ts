export interface Permissions {
  userRole: number
  userType: "admin" | "user"
  addUsers: boolean
  addUsers_admin: boolean
  addUsers_servClienti: boolean
  addUsers_agente: boolean
  addUsers_cliente: boolean
  changeRole: boolean
  changeAgenteRif: boolean
  deleteUser: boolean
  seeSuperAdmins: boolean
  seeAllUsers: boolean
  seeOwnUsers: boolean
  seeOtherUsers: boolean
}
