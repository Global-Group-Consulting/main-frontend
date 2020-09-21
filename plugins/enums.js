import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'
import Genders from '../enums/Genders'
import DocumentTypes from '../enums/DocumentTypes'
import RequestTypes from '../enums/RequestTypes'
import RequestStatus from '../enums/RequestStatus'

export default (context, inject) => {
  const enums = {
    DocumentTypes,
    Genders,
    PersonTypes,
    UserRoles,
    RequestTypes,
    RequestStatus
  }

  inject('enums', enums)

  if (!context.$enums) {
    context.$enums = enums
  }
}
