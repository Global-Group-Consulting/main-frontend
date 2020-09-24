import UserRoles from '@/enums/UserRoles'

export const state = () => ({
  wallets: [
    {
      type: 1,
      amount: 65000
    }, {
      type: 2,
      amount: 1250
    }
  ]
})

export const getters = {
  mustActivate: (state, getters, rootState) => {
    return +rootState.auth.user.role === +UserRoles.CLIENTE
      && !rootState.auth.user.activatedAt
  },
  availableWallets (state) {
    return state.wallets
  }
}
