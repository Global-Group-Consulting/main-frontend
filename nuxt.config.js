import nuxtAxios from './config/nuxtModules/nuxtAxios'
import nuxtAuth from './config/nuxtModules/nuxtAuth'
import nuxtI18n from './config/nuxtModules/nuxtI18n'
import nuxtMoment from './config/nuxtModules/nuxtMoment'
import nuxtProxy from './config/nuxtModules/nuxtProxy'
import nuxtVuetify from './config/nuxtModules/nuxtVuetify'
import nuxtVueScrollTo from './config/nuxtModules/vueScrollTo'

import * as fs from "fs"
import * as path from "path"

// Autogenerate the changelog html from .md file
import "./changelog"

const IS_BETA = !!process.env.BETA
const FAVICON_PATH = IS_BETA ? "/beta" : ""
const FAVICON_VERSION = process.env.FAVICON_VERSION
const APP_NAME = `${IS_BETA ? "[Beta] " : ""}Global Group Consulting`

const serverConfig = process.env.NODE_ENV === "development" ? {
  https: {
    key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
  }
} : {}

console.log(process.env.NODE_ENV)

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
    titleTemplate: `${IS_BETA ? "[BETA] " : ""}%s — Global Group Consulting`,
    title: 'Web App',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover'},
      {hid: 'description', name: 'description', content: "Private area for Global Group Consulting"},
      {name: "apple-mobile-web-app-title", content: `${APP_NAME}`},
      {name: "application-name", content: `${APP_NAME}`},
      {name: "msapplication-TileColor", content: "#ffffff"},
      {name: "theme-color", content: "#ffffff"},
      {name: "msapplication-config", content: `${FAVICON_PATH}/browserconfig.xml?v=${FAVICON_VERSION}`}
    ],
    link: [
      {rel: "icon", type: "image/x-icon", href: `${FAVICON_PATH}/favicon.ico?v=${FAVICON_VERSION}`},
      {rel: "icon", type: "image/png", sizes: "32x32", href: `${FAVICON_PATH}/favicon-32x32.png?v=${FAVICON_VERSION}`},
      {rel: "icon", type: "image/png", sizes: "16x16", href: `${FAVICON_PATH}/favicon-16x16.png?v=${FAVICON_VERSION}`},
      {rel: "apple-touch-icon", sizes: "180x180", href: `${FAVICON_PATH}/apple-touch-icon.png?v=${FAVICON_VERSION}`},
      {rel: "manifest", href: `${FAVICON_PATH}/site.webmanifest?v=${FAVICON_VERSION}`},
      {rel: "mask-icon", href: `${FAVICON_PATH}/safari-pinned-tab.svg?v=${FAVICON_VERSION}", color:"#071d2b`},
      {rel: "shortcut icon", href: `${FAVICON_PATH}/favicon.ico?v=${FAVICON_VERSION}`},
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
    './plugins/acl.ts',
    './plugins/axios.js',
    './plugins/alerts.ts',
    './plugins/apiCalls.ts',
    './plugins/filters.js',
    './plugins/enums.ts',
    './plugins/mixins.js',
    './plugins/global-components.js',
    './plugins/socket.ts',
    './plugins/vue-composition-api.js',
    './plugins/vue-portal.js',
    {src: './plugins/vuex-persist', ssr: false}
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  loading: {
    continuous: true,
    height: "4px",
    color: "orange",
  },

  loadingIndicator: "./components/loadingIndicator.html",

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['@nuxt/typescript-build'],
    ['@nuxtjs/vuetify', nuxtVuetify],
    ['@nuxtjs/moment', nuxtMoment]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/axios', nuxtAxios],
    ['@nuxtjs/auth-next', nuxtAuth],
    ['nuxt-i18n', nuxtI18n],
    ['@nuxtjs/proxy'],
    ['vue-scrollto/nuxt', nuxtVueScrollTo]
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
    middleware: ['storeFetch', 'auth', 'authJWT', 'aclAuth']
  },

  serverMiddleware: [
    '~/server-middleware/redirect-https.js',
    // {path: '/api', handler: '~/server/index.js' }
  ],

  server: serverConfig,

  pageTransition: {
    name: 'fade',
    mode: 'out-in',
    duration: 100
  },

  env: {
    version: require('./package.json').version,
    SOCKET_URL: process.env.SOCKET_URL
  }
}
