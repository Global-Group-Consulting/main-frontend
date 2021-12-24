import { merge as _merge } from "lodash";

const defaultData = {
  title: '',
  id: '',
  readonly: false,
  fullscreen: false,
  large: false,
  noActions: false,
  retainFocus: true,
  theme: "",
  showCloseBtn: false,
  contentClass: "",
  texts: {
    cancelBtn: "dialogs.default.cancelBtn",
    confirmBtn: "dialogs.default.confirmBtn",
  },
  data: {}
}

export const state = () => ({
  show: false,
  data: { ...defaultData }
})

export const mutations = {
  SHOW(state) {
    state.show = true
  },
  HIDE(state) {
    state.show = false
  },
  SET_DATA(state, payload) {
    // state.data = payload
    for (const key of Object.keys(defaultData)) {
      if (payload[key] && payload[key].constructor.name === "Object") {
        if (state.show) {
          _merge(state.data[key], payload[key])
        } else {
          state.data[key] = { ...defaultData[key] }
        }

      } else {
        state.data[key] = payload[key] || defaultData[key];
      }
    }
    // _merge(state.data, payload)
  },
  UPDATE_DATA (state, payload) {
    // state.data = payload
    _merge(state.data, payload);
  },
  SET_RETAIN_FOCUS (state, payload) {
    state.data.retainFocus = payload;
  }
}

export const actions = {
  /**
   *
   * @param commit
   * @param {{}} payload
   * @return {*}
   */
  updateStatus({ commit, state }, payload) {
    if (!payload || payload === false) {
      if (state.show) {
        commit('HIDE')
        commit('SET_DATA', defaultData);
      }

      return;
    }

    if (payload && typeof payload.retainFocus !== "boolean") {
      payload.retainFocus = true;
    }

    commit('SHOW');
    commit('SET_DATA', payload || {});
  },

  updateRetainFocus ({ commit }, payload) {
    commit("SET_RETAIN_FOCUS", payload ?? true);
  },

  updateData ({ commit, state }, payload) {
    commit('UPDATE_DATA', payload || {});
  },

}

export const getters = {
  dialogData (state) {
    return state.data || {};
  },
  isReadonly (state) {
    return state.data?.readonly ?? false;
  },
  dialogState (state) {
    return state.show || false;
  },
  dialogId (state) {
    return state.data?.id;
  }
}
