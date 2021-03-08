import {UserDataSchema} from "./UserFormData";


export interface AuthPlugin {
  busy: boolean,
  loggedIn: boolean,
  strategy: string
  user: UserDataSchema,

  fetchUser(): void
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $auth: AuthPlugin
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $auth: AuthPlugin
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $auth: AuthPlugin
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $auth: AuthPlugin
  }
}
