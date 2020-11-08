import UserRoles from '@/enums/UserRoles'
import Vue from 'vue';

export const state = () => ({
  appVersion: process.env.version,
  agentsList: []
})

export const mutations = {
  SET_AGENTS_LIST(state, payload) {
    Vue.set(state, "agentsList", payload)
  }
}

export const getters = {
  agentsList(state) {
    return state.agentsList
  }
}




export const actions = {
  async fetchAgentsList({ commit }, { $apiCalls }) {
    const test = Vue
    try {
      const result = await $apiCalls.fetchAgents()

      commit("SET_AGENTS_LIST", result)
    } catch (er) {
      console.error(er)
    }
  }
}
