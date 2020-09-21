export const state = () => ({
  show: false,
  data: {
    title: '',
    readonly: false
  }
})

export const mutations = {
  SHOW (state) {
    state.show = true
  },
  HIDE (state) {
    state.show = false
  },
  SET_DATA (state, payload) {
    state.data = payload
  }
}

export const actions = {
  /**
   *
   * @param commit
   * @param {{}} payload
   * @return {*}
   */
  updateStatus ({ commit }, payload) {
    if (!payload || payload === false) {
      commit('HIDE')
      commit('SET_DATA', {})

      return
    }

    commit('SHOW')
    commit('SET_DATA', payload || {})
  }
}

export const getters = {
  dialogData (state) {
    return state.data || {}
  },
  dialogState (state) {
    return state.show || false
  }
}
