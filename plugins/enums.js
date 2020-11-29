import AccountStatuses from '../enums/AccountStatuses'
import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'
import Genders from '../enums/Genders'
import DocumentTypes from '../enums/DocumentTypes'
import RequestTypes from '../enums/RequestTypes'
import RequestStatus from '../enums/RequestStatus'
import WalletTypes from '../enums/WalletTypes'
import CurrencyType from '../enums/CurrencyType'
import MessageTypes from '../enums/MessageTypes'

export const enums = {
  AccountStatuses,
  DocumentTypes,
  Genders,
  PersonTypes,
  UserRoles,
  RequestTypes,
  RequestStatus,
  WalletTypes,
  CurrencyType,
  MessageTypes
}

export default (context, inject) => {
  inject('enums', enums)

  if (!context.$enums) {
    context.$enums = enums
  }
}
