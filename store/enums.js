import {sortBy as _sortBy, capitalize as _capitalize, startCase as _startCase} from 'lodash'

export const state = () => ({
  /**
   * @type {import("../@types/Geolocation/Country").Country[]}
   */
  countries: [],

  /**
   * @type {import("../@types/Geolocation/ItaProvince").ItaProvince[]}
   */
  provinces: [],
  /**
   * @type {import("../@types/Geolocation/ItaRegion").ItaRegion[]}
   */
  regions: [],
  lastFetch: {
    countries: null,
    provinces: null,
    regions: null,
  }
})

export const getters = {
  countriesList(state, getters, rootState) {
    const list = state.countries.reduce((acc, country) => {
      const rightLangCode = Object.keys(country.translations)
        // searches for a 3 chars lang code that starts with my 2 chars
        .find(key => key.startsWith(rootState.i18n.locale))

      const countryName = country.translations[rightLangCode].common || country.name.common
      const localLang = Object.keys(country.languages)[0]
      const nativeName = country.name.native[localLang]?.common

      try {

        acc.push({
          value: (country.cca2).toLowerCase(),
          text: `${countryName}` + (nativeName && countryName.toLowerCase() !== nativeName.toLowerCase() ? ` (${nativeName})` : '')
        })
      } catch (er) {
        debugger
      }

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  countriesPhoneCodeList(state, getters, rootState) {
    const list = state.countries.reduce((acc, country) => {
      const localLang = Object.keys(country.languages)[0]

      if (country.callingCodes) {
        country.callingCodes.forEach(code => {
          if (code) {
            acc.push({
              value: "+" + code,
              text: `+${code} (${country.name.native[localLang]?.common})`
            })
          }
        })
      }

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  regionsList(state) {
    const list = state.regions.reduce((acc, region) => {
      acc.push({
        value: region.nome.toLowerCase(),
        text: _capitalize(region.nome)
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  provincesList(state) {
    const list = state.provinces.reduce((acc, province) => {
      acc.push({
        value: province.sigla.toLowerCase(),
        text: _startCase(province.nome)
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  }
}

export const mutations = {
  STORE_COUNTRIES(state, payload) {
    state.countries = payload
    state.lastFetch.countries = new Date()
  },
  STORE_REGIONS(state, payload) {
    state.regions = payload
    state.lastFetch.regions = new Date()
  },
  STORE_PROVINCES(state, payload) {
    state.provinces = payload
    state.lastFetch.provinces = new Date()
  }
}

export const actions = {
  async getCountries({commit}) {
    try {
      const data = await this.$apiCalls.geo.countries()

      commit('STORE_COUNTRIES', data)
    } catch (e) {
      console.error('- GET_COUNTRIES - ', e)
    }
  },

  async getRegions({commit}) {
    try {
      const data = await this.$apiCalls.geo.regions()

      commit('STORE_REGIONS', data)
    } catch (e) {
      console.error('- GET_REGIONS - ', e)
    }
  },

  async getProvinces({commit}) {
    try {
      const data = await this.$apiCalls.geo.provinces()

      commit('STORE_PROVINCES', data)
    } catch (e) {
      console.error('- GET_PROVINCES - ', e)
    }
  }
}
