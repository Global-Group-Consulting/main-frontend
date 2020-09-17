export default {
  strategies: {
    local: {
      autoFetchUser: false,
      endpoints:     {
        login:  { url: '/api/auth/login', method: 'post', propertyName: 'data' },
        logout: { url: '/api/auth/logout', method: 'delete' },
        user:   false
      },
      tokenRequired: false,
      tokenType:     false
    }
  },
}
