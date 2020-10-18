export default {
  fullPathRedirect: true,
  strategies: {
    local: {
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
        logout: { url: '/api/auth/logout', method: 'delete' },
        user: { url: '/api/auth/user', method: 'get' },
        refresh: { url: '/api/auth/refresh', method: 'post' },
      }
    },
    refreshScheme: {
      _scheme: '~/config/authSchemes/refreshScheme',
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
        logout: { url: '/api/auth/logout', method: 'delete' },
        user: { url: '/api/auth/user', method: 'get' },
        refresh: { url: '/api/auth/refresh', method: 'post' },
      }
    },
  },
  redirect: {
    login: '/login',
    logout: '/login',
    callback: '/login',
    home: '/'
  }
}
