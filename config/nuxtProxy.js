export default {
  '/enum/countries': {
    target: process.env.COUNTRIES_API_URL,
    pathRewrite: { '^/enum.*': '?fields=alpha2Code;name;translations;nativeName;' }
  },
  '/enum/regions': {
    target: process.env.REGIONS_API_URL,
    pathRewrite: { '^/enum.*': '' }
  },
  '/enum/provinces': {
    target: process.env.PROVINCES_API_URL,
    pathRewrite: { '^/enum.*': '' }
  },
  '/api': process.env.API_URL
}
