import {GetterTree, ActionTree, MutationTree} from 'vuex'
import {ReportsFormData} from "~/@types/Reports";

export type RootState = ReturnType<typeof state>

export const state = () => {
  return {
    dataWithdrawal: [],
    dataCommissions: [],
    loadingData: false,
    initialized: false
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_LOADING_STATE(state, payload: any) {
    state.loadingData = payload
  },
  UPDATE_INITIALIZED(state, payload: boolean) {
    state.initialized = payload
  },
  UPDATE_DATA_WITHDRAWAL(state, payload: []) {
    state.dataWithdrawal = payload
  },
  UPDATE_DATA_COMMISSIONS(state, payload: []) {
    state.dataCommissions = payload
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async fetchWithdrawalData({commit}, filters = {}) {
    commit("UPDATE_LOADING_STATE", true);

    try {
      const reportsList: ReportsFormData[] = await this.$apiCalls.reports.fetchWithdrawals(filters);
      commit("UPDATE_DATA_WITHDRAWAL", reportsList);

    } catch (er) {
      this.$alerts.error(er);

    } finally {
      commit("UPDATE_LOADING_STATE", false);

      setTimeout(() => {
        commit("UPDATE_INITIALIZED", true);
      }, 300)
    }
  },

  async resetWithdrawalData({commit}){
    commit("UPDATE_DATA_WITHDRAWAL", []);
  },

  async fetchCommissionsData({commit}, filters = {}) {
    commit("UPDATE_LOADING_STATE", true);

    try {
      const reportsList: ReportsFormData[] = await this.$apiCalls.reports.fetchCommissions(filters);
      commit("UPDATE_DATA_COMMISSIONS", reportsList);

    } catch (er) {
      this.$alerts.error(er);

    } finally {
      commit("UPDATE_LOADING_STATE", false);

      setTimeout(() => {
        commit("UPDATE_INITIALIZED", true);
      }, 300)
    }
  },

  async resetCommissionsData({commit}){
    commit("UPDATE_DATA_COMMISSIONS", []);
  },
}

export const getters: GetterTree<RootState, RootState> = {
  withdrawalsList(state): any[] {
    return state.dataWithdrawal
  },
  commissionsList(state): any[] {
    return state.dataCommissions
  },

  dataLoading(state) {
    return state.loadingData
  },

  initialized(state) {
    return state.initialized;
  }
}
