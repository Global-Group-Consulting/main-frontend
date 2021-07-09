/**
 * @typedef {import("../@types/ApiCallsPlugin").ApiCallsParams} ApiCallsParams
 */
/**
 * @typedef {import("../@types/ApiCallsPlugin").ApiCallsSettings} ApiCallsSettings
 */
import {formDataFromObject} from "../plugins/utilities"

export class BasicApiCall {
  constructor(context) {
    this.store = context.store
    this.$axios = context.$axios
    this.$gLoading = null

    this._context = context
  }

  /**
   * @param {ApiCallsParams} params
   *
   * @returns {Promise<any>}
   * @protected
   */
  async _call(params) {

    if (!this.$gLoading) {
      this.$gLoading = this._context.$gLoading
    }

    /**
     * @type {ApiCallsSettings}
     */
    const _settings = Object.assign({
      method: 'get',
      endPoint: null,
      setLoading: true,
      loadingDispatcher: null,
      returnRaw: params.returnRaw || false,
      params: params.params || null,
      data: params.body || null
    }, params)

    if (!_settings.setLoading && _settings.loadingDispatcher) {
      _settings.setLoading = true
    }

    let _rawResult = null
    let _result = null
    let _mustReject = false

    // If there is no endpoint specified, returns an error
    if (!_settings.endPoint) {
      throw new Error('API endPoint missing.')
    }

    if (this.$gLoading && _settings.setLoading) {
      // before calling the endpoint, sets the state of loading, if the case
      this.$gLoading.state = true
      _settings.loadingDispatcher && (this.$gLoading.dispatcher = _settings.loadingDispatcher)
    }

    try {
      const axiosParams = {
        method: _settings.method,
        url: _settings.endPoint,
        // headers: this.$axios.defaults.headers.common
      }

      if (_settings.data) {
        axiosParams.data = _settings.uploadMode ? formDataFromObject(_settings.data, null, null, false) : _settings.data
      }

      if (_settings.params) {
        axiosParams.params = _settings.params
      }

      if (_settings.downloadMode) {
        axiosParams.responseType = 'blob'
      }

      if (_settings.uploadMode) {
        if (!axiosParams.headers) axiosParams.headers = {}

        axiosParams.headers['Content-Type'] = 'multipart/form-data'
      }

      _rawResult = await this.$axios(axiosParams)

      _result = (_settings.returnRaw || _settings.downloadMode) ? _rawResult : _rawResult.data
    } catch (e) {
      _mustReject = true
      _result = e
    }

    if (this.$gLoading && _settings.setLoading) {
      // once the call has ended, in any case, resets the loading state
      this.$gLoading.reset()
    }

    return Promise[_mustReject ? 'reject' : 'resolve'](_result)
  }

  /**
   *
   * @param {ApiCallsParams | String | {}} params
   * @returns {Promise<any>}
   * @protected
   */
  async get(params) {
    /**
     * @type {ApiCallsParams}
     */
    const callParams = {}

    if (typeof params === 'string') {
      callParams.endPoint = params
    } else {
      // merges users params with default ones
      Object.assign(callParams, params)
    }

    return this._call(callParams)
  }

  /**
   *
   * @param {ApiCallsParams | String | {}} params
   * @returns {Promise<any>}
   * @protected
   */
  async post(params) {
    /**
     * @type {CallParams}
     */
    const callParams = {
      method: 'post'
    }

    if (typeof params === 'string') {
      callParams.endPoint = params
    } else {
      // merges users params with default ones
      Object.assign(callParams, params)
    }

    return this._call(callParams)
  }
}
