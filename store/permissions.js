import UserRoles from "../enums/UserRoles"

export const state = () => {

}

export const getters = {
  userRole(state, getters, rootState) {
    return rootState.$auth.user.role
  },

  superAdmin(state, getters, rootState) {
    return rootState.$auth.user.superAdmin
  },

  userType(state, getters) {
    return [UserRoles.ADMIN, UserRoles.SERV_CLIENTI]
      .includes(+getters.userRole) ? "admin" : "user"
  },

  addUsers(state, getters) {
    return getters.userRole !== UserRoles.CLIENTE
  },
  addUsers_admin(state, getters) {
    return !!getters.superAdmin
  },
  addUsers_servClienti(state, getters) {
    return !!getters.superAdmin
  },
  addUsers_agente(state, getters) {
    return getters.userType === "admin"
  },
  addUsers_cliente(state, getters) {
    return getters.userRole !== UserRoles.CLIENTE
  },
  changeRole(state, getters,) {
    return !!getters.superAdmin
  },
}
