import nuxtAxios from './config/nuxtModules/nuxtAxios'
import nuxtAuth from './config/nuxtModules/nuxtAuth'
import nuxtI18n from './config/nuxtModules/nuxtI18n'
import nuxtMoment from './config/nuxtModules/nuxtMoment'
import nuxtProxy from './config/nuxtModules/nuxtProxy'
import nuxtVuetify from './config/nuxtModules/nuxtVuetify'
import nuxtVueScrollTo from './config/nuxtModules/vueScrollTo'

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  ssr: false,
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s — Global Group Consulting',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "Private area for Global Group Consulting" }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: "180x180", href: "/apple-icon.png" },
      { rel: 'icon', type: 'image/png', sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: 'icon', type: 'image/png', sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    './plugins/alerts.js',
    './plugins/apiCalls.js',
    './plugins/filters.js',
    './plugins/enums.js',
    './plugins/mixins.js',
    './plugins/global-components.js',
    './plugins/vue-composition-api.js',
    './plugins/vue-portal.js',
    { src: './plugins/vuex-persist', ssr: false }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['@nuxtjs/vuetify', nuxtVuetify],
    ['@nuxtjs/moment', nuxtMoment]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/axios', nuxtAxios],
    ['@nuxtjs/auth', nuxtAuth],
    ['nuxt-i18n', nuxtI18n],
    ['@nuxtjs/proxy'],
    ['vue-scrollto/nuxt', nuxtVueScrollTo],
  ],

  /*
  Proxy settings must be specified here, otherwise won't be read
  if used as module settings.
  */
  proxy: nuxtProxy,

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: ['@nuxtjs/auth']
  },

  router: {
    middleware: ['storeFetch', 'auth', 'authJWT']
  },

  serverMiddleware: [
    // { path: '/api', handler: '~/server/index.js' }
  ]
}
