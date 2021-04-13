export default {
  fullPathRedirect: true,
  strategies: {
    local: {
      scheme: 'refresh',
      token: {
        property: 'token',
        maxAge: 1800,
        // type: 'Bearer'
      },
      refreshToken: {
        property: 'refreshToken',
        data: 'refreshToken',
      },
      user: {
        property: '',
        autoFetch: true
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
  },
}
