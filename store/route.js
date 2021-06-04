import {merge as _merge} from "lodash";
import Vue from "vue"

export const state = () => ({})

export const mutations = {
  SET_ROUTE(state, payload) {
    for (const key of Object.keys(payload)) {
      Vue.set(state, key, payload[key]);
    }
  }
}

export const actions = {
  updateRoute({commit, state}, payload) {
    commit('SET_ROUTE', payload)
  },
}
