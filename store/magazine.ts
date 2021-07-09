import Vue from "vue";
import {GetterTree, ActionTree, MutationTree} from 'vuex'

export type RootState = ReturnType<typeof state>


export const state = () => {
  return {
    magazines: [],
    currentMagazine: null,
    lastFetch: null
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_MAGAZINE_DATA(state, payload: any) {
    Vue.set(state, "magazines", payload)
  },
  UPDATE_CURRENT_MAGAZINE(state, payload: any) {
    state.currentMagazine = payload
  },
  UPDATE_LAST_FETCH(state, payload) {
    state.lastFetch = payload
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async fetch({commit}) {
    try {
      const data = await this.$apiCalls.magazine.index();

      commit("UPDATE_MAGAZINE_DATA", data)
      commit("UPDATE_LAST_FETCH", new Date())
    } catch (e) {
      this.$alerts.error(e)
    }
  },

  async fetchCurrent({commit}) {
    try {
      const data = await this.$apiCalls.magazine.current();

      commit("UPDATE_CURRENT_MAGAZINE", data)
    } catch (e) {
      this.$alerts.error(e)
    }
  },
}

export const getters: GetterTree<RootState, RootState> = {
  currentMagazine(state) {
    return state.currentMagazine;
  },

  magazines(state) {
    return state.magazines
  }
}
