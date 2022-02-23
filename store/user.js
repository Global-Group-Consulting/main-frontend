import Vue from "vue"
import UserRoles from '../enums/UserRoles'
import WalletTypes from "../enums/WalletTypes"
import {computed} from "@vue/composition-api";
import acl from "~/plugins/acl";
import {AclUserRoles} from "~/enums/AclUserRoles";

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
  async updateWallets({commit}, {data, apiCalls}) {
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
  current(state, getters, rootState) {
    return rootState.auth.user;
  },

  mustActivate: (state, getters, rootState) => {
    return +rootState.auth.user.role === +UserRoles.CLIENTE
      && !rootState.auth.user.activatedAt
  },
  availableWallets(state) {
    return state.wallets
  },

  userRole: (state, getters, rootState) => {
    return rootState.auth.user.role
  },
  userIsGold: (state, getters, rootState) => {
    return rootState.auth.user.gold
  },
  /**
   *
   * @param state
   * @param getters
   * @returns {"admin" | "user"}
   */
  userType: (state, getters) => {
    return [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+getters.userRole) ? "admin" : "user"
  },
  userIsCliente: (state, getters, rootState) => {
    return [UserRoles.CLIENTE].includes(rootState.auth.user.role)
  },
  userIsAgente: (state, getters, rootState, a, b, c) => {
    return $nuxt.$acl.checkRoles([AclUserRoles.AGENT])
    // return [UserRoles.AGENTE].includes(rootState.auth.user.role)
  },
  userIsAdmin: (state, getters, rootState) => {
    return [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(rootState.auth.user.role)
  },
  userIsRealAdmin: (state, getters, rootState) => {
    return [UserRoles.ADMIN].includes(rootState.auth.user.role)
  },
  userIsSuperAdmin: (state, getters, rootState) => {
    return !!rootState.auth.user.superAdmin
  },
  canAddUsers: (state, getters) => getters.userRole !== UserRoles.CLIENTE,
  canAddUsers_admin: (state, getters) => !!getters.userIsSuperAdmin,
  canAddUsers_servClienti: (state, getters) => !!getters.userIsSuperAdmin,
  canAddUsers_agente: (state, getters) => getters.userType === "admin" && !!getters.userIsSuperAdmin,
  canAddUsers_cliente: (state, getters) => getters.userRole !== UserRoles.CLIENTE,
  canAddRequest: (state, getters) => getters.userType === "user",
  canAddRequestGold: (state, getters) => getters.userType === "user" && getters.userIsGold,
  canChangeRole: (state, getters) => !!getters.userIsSuperAdmin,
  canChangeState: (state, getters) => !!getters.userIsSuperAdmin,
  canChangeAgenteRif: (state, getters) => getters.userType === "admin",
  canDeleteUser: (state, getters) => !!getters.userIsSuperAdmin,
  canSeeSuperAdmins: (state, getters) => !!getters.userIsSuperAdmin,
  seeAllUsers: (state, getters) => getters.userType === "admin",
  seeOwnUsers: (state, getters) => getters.userRole === UserRoles.AGENTE,
  canSeeOtherUsers: (state, getters) => getters.seeAllUsers || getters.seeOwnUsers
}
