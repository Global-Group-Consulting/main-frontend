import AccountStatuses from '../enums/AccountStatuses'
import AgentTeamType from '../enums/AgentTeamType'
import CommissionType from '../enums/CommissionType'
import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'
import Genders from '../enums/Genders'
import DocumentTypes from '../enums/DocumentTypes'
import RequestTypes from '../enums/RequestTypes'
import RequestStatus from '../enums/RequestStatus'
import WalletTypes from '../enums/WalletTypes'
import MessageTypes from '../enums/MessageTypes'
import MovementTypes from '../enums/MovementTypes'
import ClubPacks from '../enums/ClubPacks'
import ClubMovementTypes from '../enums/ClubMovementTypes'
import CurrencyType from "~/enums/CurrencyType";

import {Plugin} from "@nuxt/types";

export const enums = {
  AccountStatuses,
  AgentTeamType,
  CommissionType,
  CurrencyType,
  ClubPacks,
  ClubMovementTypes,
  DocumentTypes,
  Genders,
  MessageTypes,
  MovementTypes,
  PersonTypes,
  RequestStatus,
  RequestTypes,
  UserRoles,
  WalletTypes,
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $enums: typeof enums
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $enums: typeof enums
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $enums: typeof enums
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $enums: typeof enums
  }
}

const enumsPlugin: Plugin = (context, inject) => {
  inject('enums', enums)
}

export default enumsPlugin
