import { sortBy as _sortBy, capitalize as _capitalize } from 'lodash'

export const state = () => ({
  /**
   * @type {{}[]}
   * @property {string} name
   * @property {string} nativeName
   * @property {string} alpha2Code
   * @property {{key:string, value:string}[]} translations
   */
  countries: [],

  /**
   * @type {{}[]}
   * @property {string} codice
   * @property {string} nome
   * @property {string} regione
   * @property {string} sigla
   */
  provinces: [],
  regions: []
})

export const getters = {
  countriesList (state, getters, rootState) {
    const list = state.countries.reduce((acc, country) => {
      const countryName = country.translations[rootState.i18n.locale] || country.name

      acc.push({
        value: country.alpha2Code || country.name,
        text: `${countryName} (${country.nativeName})`
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  regionsList (state) {
    const list = state.regions.reduce((acc, region) => {
      acc.push({
        value: region.toLowerCase(),
        text: _capitalize(region)
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  provincesList (state) {
    const list = state.provinces.reduce((acc, province) => {
      acc.push({
        value: province.sigla,
        text: _capitalize(province.nome)
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  }
}

export const mutations = {
  STORE_COUNTRIES (state, payload) {
    state.countries = payload
  },
  STORE_REGIONS (state, payload) {
    state.regions = payload
  },
  STORE_PROVINCES (state, payload) {
    state.provinces = payload
  }
}

export const actions = {
  async getCountries ({ commit }) {
    try {
      const data = await this.$axios.$get('/enum/countries')

      commit('STORE_COUNTRIES', data)
    } catch (e) {
      console.error('- GET_COUNTRIES - ', e)
    }
  },

  async getRegions ({ commit }) {
    try {
      const data = await this.$axios.$get('/enum/regions')

      commit('STORE_REGIONS', data)
    } catch (e) {
      console.error('- GET_REGIONS - ', e)
    }
  },

  async getProvinces ({ commit }) {
    try {
      const data = await this.$axios.$get('/enum/provinces')

      commit('STORE_PROVINCES', data)
    } catch (e) {
      console.error('- GET_PROVINCES - ', e)
    }
  }
}
