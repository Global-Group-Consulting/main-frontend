import {sortBy as _sortBy, capitalize as _capitalize, startCase as _startCase} from 'lodash'

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
      const countryName = country.translations[rootState.i18n.locale] || country.name

      acc.push({
        value: country.alpha2Code || country.name,
        text: `${countryName} (${country.nativeName})`
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  countriesPhoneCodeList(state, getters, rootState) {
    const list = state.countries.reduce((acc, country) => {
      // const countryName = country.translations[rootState.i18n.locale] || country.name

      if (country.callingCodes) {
        country.callingCodes.forEach(code => {
          if (code) {
            acc.push({
              value: "+" + code,
              text: `+${code} (${country.nativeName})`
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
        value: region.toLowerCase(),
        text: _capitalize(region)
      })

      return acc
    }, [])

    return _sortBy(list, ['text'])
  },
  provincesList(state) {
    const list = state.provinces.reduce((acc, province) => {
      acc.push({
        value: province.sigla,
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
      const data = await this.$axios.$get('/enum/countries')

      commit('STORE_COUNTRIES', data)
    } catch (e) {
      console.error('- GET_COUNTRIES - ', e)
    }
  },

  async getRegions({commit}) {
    try {
      const data = await this.$axios.$get('/enum/regions')

      commit('STORE_REGIONS', data)
    } catch (e) {
      console.error('- GET_REGIONS - ', e)
    }
  },

  async getProvinces({commit}) {
    try {
      const data = await this.$axios.$get('/enum/provinces')

      commit('STORE_PROVINCES', data)
    } catch (e) {
      console.error('- GET_PROVINCES - ', e)
    }
  }
}
