import Vue from "vue"
import UserRoles from '../enums/UserRoles'
import WalletTypes from "../enums/WalletTypes"

const emptyWallets = [{
  type: WalletTypes.DEPOSIT,
  deposit: 0,
  interestAmount: 0,
  interestPercentage: 0
}, {
  type: WalletTypes.COMMISION,
  currMonthCommissions: 0,
}]

export const state = () => ({
  wallets: [
    ...emptyWallets
  ]
})

export const mutations = {
  UPDATE_WALLETS(state, payload) {
    for (const wallet of payload) {
      const index = state.wallets.findIndex(_w => _w.type === wallet.type)

      Vue.set(state.wallets, index, wallet)
    }
  }
}

export const actions = {
  async updateWallets({ commit }, { data, apiCalls }) {
    try {
      commit("UPDATE_WALLETS", emptyWallets)

      console.info("RESETED WALLETS")

      /**
       * @type {{
       *  deposit: number
       *  interestAmount: number
       *  interestPercentage: number
       * }}
       */
      const result = await apiCalls.fetchWalletStatus(data);

      commit("UPDATE_WALLETS", [{
        ...result,
        type: WalletTypes.DEPOSIT
      }, {
        currMonthCommissions: result.currMonthCommissions,
        type: WalletTypes.COMMISION
      }])
    } catch (er) {
      console.error(er)
    }
  }
}

export const getters = {
  mustActivate: (state, getters, rootState) => {
    return +rootState.auth.user.role === +UserRoles.CLIENTE
      && !rootState.auth.user.activatedAt
  },
  availableWallets(state) {
    return state.wallets
  }
}
