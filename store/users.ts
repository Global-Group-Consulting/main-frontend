import {GetterTree, ActionTree, MutationTree} from 'vuex'
import RequestStatus from "~/enums/RequestStatus";
import {User} from "~/@types/UserFormData";
import UserRoles from "~/enums/UserRoles";
import {computed} from "@vue/composition-api";
import AccountStatuses from "~/enums/AccountStatuses";

export type RootState = ReturnType<typeof state>

export const state = () => {
  return {
    data: [] as { data: User[], id: number }[],
    agentsUsers: [] as User[],
    loadingData: false,
    initialized: false
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_DATA(state, payload: any) {
    state.data = payload
  },
  UPDATE_AGENT_USERS_DATA(state, payload: any) {
    state.agentsUsers = payload
  },
  UPDATE_LOADING_STATE(state, payload: any) {
    state.loadingData = payload
  },
  UPDATE_INITIALIZED(state, payload: boolean) {
    state.initialized = payload
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async fetchData({commit, state, getters, rootState}) {
    commit("UPDATE_LOADING_STATE", true);

    try {
      const usersList = await this.$apiCalls.fetchAllUsers()

      commit("UPDATE_DATA", usersList);

      await this.dispatch("filters/updateDataToFilter", Object.values(getters.usersGroups).flat());
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      commit("UPDATE_LOADING_STATE", false);

      setTimeout(() => {
        commit("UPDATE_INITIALIZED", true);
      }, 300)
    }
  },

  async fetchAgentClients({commit, state, getters}, userId) {
    commit("UPDATE_LOADING_STATE", true);

    try {
      const usersList = await this.$apiCalls.getClientsList(userId)

      commit("UPDATE_AGENT_USERS_DATA", usersList);

      //this.dispatch("filters/updateDataToFilter", Object.values(getters.usersGroups).flat());
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      commit("UPDATE_LOADING_STATE", false);

      setTimeout(() => {
        commit("UPDATE_INITIALIZED", true);
      }, 300)
    }
  }
}

export const getters: GetterTree<RootState, RootState> = {
  usersGroups(state): Record<any, any[]> {
    const toReturn: Record<any, User[]> = {
      [UserRoles.getIdName(UserRoles.AGENTE)]: [],
      [UserRoles.getIdName(UserRoles.CLIENTE)]: [],
      [UserRoles.getIdName(UserRoles.SERV_CLIENTI)]: [],
      [UserRoles.getIdName(UserRoles.ADMIN)]: [],
    };

    for (const group of state.data) {
      toReturn[UserRoles.getIdName(+group.id)].push(...group.data)
    }

    return toReturn
  },

  agentUsersGroups(state, getters, rootState, rootGetters): Record<any, any[]> {
    const toReturn: Record<any, User[]> = {
      [UserRoles.getIdName(UserRoles.AGENTE)]: [],
      [UserRoles.getIdName(UserRoles.CLIENTE)]: [],
      [UserRoles.getIdName(UserRoles.SERV_CLIENTI)]: [],
      [UserRoles.getIdName(UserRoles.ADMIN)]: [],
    };

    for (const user of state.agentsUsers) {
      if (user.id === rootGetters["user/current"].id) {
        continue
      }

      toReturn[UserRoles.getIdName(+user.role)].push(user)
    }

    return toReturn
  },

  usersStatistics(state, getters) {
    const data: User[] = Object.values(getters.usersGroups).flat() as User[];

    return getStatistics(data)
  },

  agentUsersStatistics(state, getters) {
    const data: User[] = Object.values(getters.agentUsersGroups).flat() as User[];

    return getStatistics(data)
  },

  dataLoading(state) {
    return state.loadingData
  },

  initialized(state) {
    return state.initialized;
  }
}

function getStatistics(data: User[]) {
  return {
    draft: data.filter(user => user.account_status === AccountStatuses.DRAFT).length,
    pendingSignature: data.filter(user => user.account_status === AccountStatuses.VALIDATED).length,
    pendingFirstAccess: data.filter(user => user.account_status === AccountStatuses.APPROVED).length,
    active: data.filter(user => user.account_status === AccountStatuses.ACTIVE).length
  }
}
