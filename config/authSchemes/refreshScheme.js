import LocalScheme from '@nuxtjs/auth/lib/schemes/local'
import jwt from 'jsonwebtoken'
import moment from 'moment'

export default class RefreshScheme extends LocalScheme {
  async mounted() {
    this.$auth.checkToken = () => this.checkToken()

    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)

      // i already o the checks in the middleware authJWT
      // await this.checkToken()

      this._setToken(token)
    }

    return this.$auth.fetchUserOnce()
  }

  _setNewTokens(token, refreshToken) {
    token = this.options.tokenType
      ? this.options.tokenType + ' ' + token
      : token

    refreshToken = this.options.tokenType
      ? this.options.tokenType + ' ' + refreshToken
      : refreshToken

    this.$auth.setToken(this.name, token || false)
    this.$auth.setRefreshToken(this.name, refreshToken || false)

    this._setToken(token)
  }

  async login(endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    const { response, result } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login,
      true
    )

    if (this.options.tokenRequired) {
      this._setNewTokens(result, response.data.refreshToken)
    }

    if (this.options.autoFetchUser) {
      await this.fetchUser()
    }

    return response
  }

  async checkToken() {
    const token = this.$auth.syncToken(this.name)
    const refreshToken = this.$auth.syncRefreshToken(this.name)

    /**
     * must decode token and check expiration
     * if almost expired, tries to refresh.
     *
     * @type {{uid: string, iat: number, exp: number}}
     */
    const tokenData = jwt.decode(token.split(' ')[1])

    const dateNow = moment()
    const dateExp = moment.unix(tokenData.exp)

    // useful to refresh tje token 2 minutes before expiration
    const maxDate = dateExp.subtract('2', 'minutes')

    // if the current time is after the maxDate, must refresh the token
    if (dateNow.isSameOrAfter(maxDate)) {
      try {
        await this.refreshToken(refreshToken)
      } catch (er) {
        // await this.$auth.logout()
      }
    }
  }

  async refreshToken(refreshToken) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.refresh) {
      return
    }

    try {
      // Try to fetch user and then set
      const { response, result } = await this.$auth.request(
        { data: { refresh_token: refreshToken } },
        this.options.endpoints.refresh,
        true
      )

      this._setNewTokens(result.token, result.refreshToken)
    } catch (er) {
      const resp = er.response

      if (resp.data && resp.data.error && resp.data.error.name === "InvalidRefreshToken") {
        await this.$auth.logout()
      }
    }
  }

  async setUserToken({ token, refreshToken }) {
    this._setNewTokens(token, refreshToken)

    return this.fetchUser()
  }
}
