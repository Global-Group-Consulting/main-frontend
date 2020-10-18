/**
 * @typedef CallParams
 * @type {{}}
 * @property {String} method
 * @property {String} endPoint
 * @property {Boolean} setLoading
 * @property {{}} params
 * @property {{}} body
 * @property {String} [loadingDispatcher]
 * @property {Boolean} [returnRaw]=false
 * @property {Boolean} [downloadMode]=false
 * @property {Boolean} [uploadMode]=false
 */

export class BasicApiCall {
  constructor (context) {
    this.store = context.store
    this.$axios = context.$axios
    this.$gLoading = null

    this._context = context
  }

  /**
   * @param {CallParams} params
   *
   * @returns {Promise<*>}
   * @private
   */
  async _call (params) {
    if (!this.$gLoading) {
      this.$gLoading = this._context.$gLoading
    }

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
        axiosParams.data = _settings.data
      }

      if (_settings.params) {
        axiosParams.params = _settings.params
      }

      if (_settings.downloadMode) {
        axiosParams.responseType = 'blob'
      }

      if (_settings.uploadMode) {
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
   * @param {CallParams | String | {}} params
   * @returns {Promise<void>}
   * @protected
   */
  async get (params) {
    /**
     * @type {CallParams}
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
   * @param {CallParams | String | {}} params
   * @returns {Promise<void>}
   * @protected
   */
  async post (params) {
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
