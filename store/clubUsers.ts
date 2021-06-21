import {GetterTree, ActionTree, MutationTree} from 'vuex'
import RequestStatus from "~/enums/RequestStatus";
import {User} from "~/@types/UserFormData";
import UserRoles from "~/enums/UserRoles";
import {computed} from "@vue/composition-api";
import AccountStatuses from "~/enums/AccountStatuses";
import ClubPacks from "~/enums/ClubPacks";

export type RootState = ReturnType<typeof state>

export const state = () => {
  return {
    data: [] as User[],
    loadingData: false,
    initialized: false
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_DATA(state, payload: any) {
    state.data = payload
  },
  UPDATE_LOADING_STATE(state, payload: any) {
    state.loadingData = payload
  },
  UPDATE_INITIALIZED(state, payload: boolean) {
    state.initialized = payload
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async fetchData({commit}) {
    commit("UPDATE_LOADING_STATE", true);

    try {
      const usersList = await this.$apiCalls.fetchClubUsers()

      commit("UPDATE_DATA", usersList);

      await this.dispatch("filters/updateDataToFilter", usersList);
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      commit("UPDATE_LOADING_STATE", false);

      setTimeout(() => {
        commit("UPDATE_INITIALIZED", true);
      }, 300)
    }
  },

}

export const getters: GetterTree<RootState, RootState> = {
  usersGroups(state): User[] {
    return state.data
  },

  usersStatistics(state, getters) {
    const data: User[] = Object.values(getters.usersGroups).flat() as User[];

    return {
      packUnsubscribed: data.filter(user => user.clubPack === ClubPacks.UNSUBSCRIBED).length,
      packBasic: data.filter(user => user.clubPack === ClubPacks.BASIC).length,
      packFast: data.filter(user => user.clubPack === ClubPacks.FAST).length,
      packPremium: data.filter(user => user.clubPack === ClubPacks.PREMIUM).length
    }
  },

  dataLoading(state) {
    return state.loadingData
  },

  initialized(state) {
    return state.initialized;
  }
}
