import Vue from "vue";
import UserRoles from "~/enums/UserRoles";
import moment from "moment";


export const state = () => {
  return {
    globalSettings: {},
    userSettings: {},
    lastFetch: null
  }
}

export const mutations = {
  UPDATE_GLOBAL_SETTINGS(state, payload) {
    for (let i in payload) {
      Vue.set(state.globalSettings, payload[i].name, payload[i].value)
    }
  },
  UPDATE_USER_SETTINGS(state, payload) {
    for (let i in payload) {
      Vue.set(state.userSettings, payload[i].name, payload[i].value)
    }
  },
  UPDATE_LAST_FETCH(state, payload) {
    state.lastFetch = payload
  }
}

export const actions = {
  /**
   * @param commit
   * @param {{}} data
   * @param {"global" | "user"} type
   * @returns {Promise<void>}
   */
  async updateSettings({commit}, {data, type}) {
    if (type === "global") {
      commit("UPDATE_GLOBAL_SETTINGS", data)
    } else if (type === "user") {
      commit("UPDATE_USER_SETTINGS", data)
    }

    commit("UPDATE_LAST_FETCH", new Date())
  },

  async fetchSettings({commit}, user) {
    try {
      const globalSettings = await this.$apiCalls.readGlobalSettings();
      commit("UPDATE_GLOBAL_SETTINGS", globalSettings)

      if (user.id) {
        const userSettings = await this.$apiCalls.readUserSettings(user.id);
        commit("UPDATE_USER_SETTINGS", userSettings)
      }

      commit("UPDATE_LAST_FETCH", new Date())
    } catch (e) {
      this.$alerts.error(e)
    }
  }
}

export const getters = {
  globalSettings(state) {
    return state.globalSettings
  },
  userSettings(state) {
    return state.userSettings
  },
  maintenanceMode(state) {
    return state.globalSettings.maintenanceMode
  },
  outOfTimeFrame(state, getters) {
    const timeFrame = getters.timeFrame;
    const nowDate = moment();

    const startTime = moment(timeFrame.start, "HH:mm")
    const endTime = moment(timeFrame.end, "HH:mm")

    if (nowDate.isBefore(startTime) || nowDate.isAfter(endTime)) {
      return true
    }

    return false
  },
  timeFrame(state, getters, rootState) {
    const authUser = rootState.auth.user
    const userAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(authUser.role)
    const nowDate = moment()

    const criticalDays = [15, nowDate.clone().endOf('month')];
    const isCriticalDay = criticalDays.includes(nowDate.date());
    const timeIntervalBasic = state.globalSettings.requestsBlockTime;
    const timeIntervalCritical = state.globalSettings.requestsBlockTimeCriticDays;

    let timeInterval = isCriticalDay ? timeIntervalCritical : timeIntervalBasic;

    // If user is admin
    if (userAdmin) {
      // And if is not a critical day, don't block it.
      if (!isCriticalDay) {
        return false
      }

      // If is a critical day and the user is admin set the interval
      timeInterval = ["05:00", "22:00"]
    }

    return {
      start: timeInterval ? timeInterval[0] : "",
      end: timeInterval ? timeInterval[1] : ""
    }
  },
  isReadonly(state, getters) {
    return getters.outOfTimeFrame || getters.maintenanceMode
  }
}
