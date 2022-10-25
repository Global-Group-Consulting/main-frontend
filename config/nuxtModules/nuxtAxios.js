export default {
  //baseURL: process.env.NODE_ENV === 'development' ? process.env.API_URL : null,
  proxy: process.env.NODE_ENV !== 'development',
  credentials: true,
  debug: false, //process.env.NODE_ENV === 'development',
  headers: {
    common: {
      // 'Accept': 'application/json, text/plain, */*',
      "Client-Key": process.env.APP_CLIENT_KEY
    },
  }
}
