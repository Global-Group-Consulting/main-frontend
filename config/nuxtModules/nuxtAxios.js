export default {
  //baseURL: process.env.NODE_ENV === 'development' ? process.env.API_URL : null,
  proxy: process.env.NODE_ENV !== 'development',
  credentials: true,
  debug: process.env.NODE_ENV === 'development'
}
