export default {
  fullPathRedirect: true,
  strategies: {
    local: {
      // autoFetchUser: false,
      endpoints: {
        login: { url: '/api/auth/login', method: 'post', propertyName: 'data' },
        logout: { url: '/api/auth/logout', method: 'delete' },
        user: { url: '/api/auth/user', method: 'get' }
      }
    }
  },
}
