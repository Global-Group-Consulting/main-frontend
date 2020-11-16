export const state = () => ({
  show: false,
  data: {
    title: '',
    id: '',
    readonly: false,
    fullscreen: false,
    noActions: false,
    retainFocus: true,
    data: {}
  }
})

export const mutations = {
  SHOW(state) {
    state.show = true
  },
  HIDE(state) {
    state.show = false
  },
  SET_DATA(state, payload) {
    state.data = payload
  },
  SET_RETAIN_FOCUS(state, payload) {
    state.data.retainFocus = payload
  }
}

export const actions = {
  /**
   *
   * @param commit
   * @param {{}} payload
   * @return {*}
   */
  updateStatus({ commit }, payload) {
    if (!payload || payload === false) {
      commit('HIDE')
      commit('SET_DATA', {})

      return
    }

    if (payload && typeof payload.retainFocus !== "boolean") {
      payload.retainFocus = true
    }

    commit('SHOW')
    commit('SET_DATA', payload || {})
  },

  updateRetainFocus({ commit }, payload) {
    commit("SET_RETAIN_FOCUS", payload ?? true)
  }
}

export const getters = {
  dialogData(state) {
    return state.data || {}
  },
  dialogState(state) {
    return state.show || false
  },
  dialogId(state) {
    return state.data?.id
  }
}
