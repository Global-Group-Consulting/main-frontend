import UserRoles from '@/enums/UserRoles'

export const state = () => ({})

export const getters = {
  mustActivate (store) {
    return (
      store.$auth?.user.role === UserRoles.CLIENTE
    )
  }
}
