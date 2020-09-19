import UserRoles from '@/enums/UserRoles'

export const state = () => ({})

export const getters = {
  mustActivate: (state, getters, rootState) => {
    return +rootState.auth.user.role === +UserRoles.CLIENTE
  }
}
