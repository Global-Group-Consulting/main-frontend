import {GetterTree, ActionTree, MutationTree} from 'vuex'
import {RequestFormData} from "~/@types/Requests";
import RequestStatus from "~/enums/RequestStatus";

export type RootState = ReturnType<typeof state>
export type RequestGroups = "nuova" | "lavorazione" | "accettata" | "rifiutata";

export const state = () => {
  return {
    data: [] as RequestFormData[],
    loadingData: false
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_DATA(state, payload: any) {
    state.data = payload
  },
  UPDATE_LOADING_STATE(state, payload: any) {
    state.loadingData = payload
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async fetchData({commit, state, getters, rootState}) {
    commit("UPDATE_LOADING_STATE", true);

    try {
      const requestsList: RequestFormData[] = await this.$apiCalls.fetchRequests();
      const existsAutoWithdraw = getters["requestsGroups"].lavorazione.find((req: any) => req.autoWithdrawlAll)

      commit("UPDATE_DATA", requestsList);

      this.dispatch("filters/updateDataToFilter", requestsList);

      // If in the list of working request does not exist an autoWithdraw request and the user still has one in its data,
      // updates the user data
      if (!existsAutoWithdraw && this.$auth.user.autoWithdrawlAll) {
        const user = this.$auth.user;

        this.$auth.setUser({
          ...user,
          autoWithdrawlAll: null,
          autoWithdrawlAllRecursively: null
        })
      }
    } catch (er) {
      this.$alerts.error(er);
    } finally {
      commit("UPDATE_LOADING_STATE", false);
    }
  }
}

export const getters: GetterTree<RootState, RootState> = {
  requestsGroups(state): Record<RequestGroups, any[]> {
    const toReturn: any = {
      nuova: [],
      lavorazione: [],
      accettata: [],
      rifiutata: []
    };

    state.data.forEach((richiesta: any) => {
      const stato = RequestStatus.get(richiesta.status);
      let groupName: string = stato.id;

      if (groupName === "annullata") {
        groupName = "accettata";
      }

      toReturn[groupName].push(richiesta);
    });

    return toReturn;
  },

  dataLoading(state) {
    return state.loadingData
  }
}
