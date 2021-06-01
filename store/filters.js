import {merge as _merge} from "lodash";
import Vue from "vue"

export const state = () => ({
  pages: {},
  filteredData: [],
  dataToFilter: [],
  expanded: false
})

export const mutations = {
  /**
   * @param state
   * @param {{activeFilters: {}, page: string}} payload
   * @constructor
   */
  SET_PAGE(state, payload) {
    Vue.set(state.pages, payload.page, {...payload.activeFilters});
  },

  SET_FILTERED_DATA(state, payload) {
    state.filteredData = [...payload];
  },

  SET_DATA_TO_FILTER(state, payload) {
    state.dataToFilter = [...payload]
  },

  SET_EXPANDED(state, payload) {
    state.expanded = payload;
  }
}

export const actions = {
  /**
   *
   * @param commit
   * @param state
   * @param {{activeFilters: {}, page: string}} payload
   */
  updatePage({commit, state}, payload) {
    if (!payload || !payload.page) {
      console.error("Missing filters page")
      return
    }

    if (!payload.activeFilters) {
      payload.activeFilters = {}
    }

    commit('SET_PAGE', payload)
  },

  updateFilteredData({commit, state}, payload) {
    commit("SET_FILTERED_DATA", payload || [])
  },

  updateDataToFilter({commit, state}, payload) {
    commit("SET_DATA_TO_FILTER", payload || [])
  },

  updateExpanded({commit}, payload = false) {
    commit("SET_EXPANDED", payload)
  },

  resetAll({commit, state}, payload) {
    commit('SET_PAGE', {
      page: payload.page,
      activeFilters: {},
      dataToFilter: []
    })
    commit("SET_FILTERED_DATA", []);
    commit("SET_EXPANDED", false)
  }
}

export const getters = {
  areActiveFilters(state, getters) {
    return getters.activeFilters && Object.keys(getters.activeFilters).length > 0
  },
  activeFilters(state, getters, rootState) {
    return state.pages[rootState.route.path]
  },
  filteredData(state, getters) {
    if (!getters.areActiveFilters) {
      return null
    }

    return state.filteredData
  },
  countActiveFilters(state, getters) {
    return getters.activeFilters ? Object.keys(getters.activeFilters).length : 0
  },
  countFilteredData(state, getters) {
    return getters.filteredData ? getters.filteredData.length : 0
  },

  dataToFilter(state) {
    return state.dataToFilter
  },

  expanded(state) {
    return state.expanded
  }
}
