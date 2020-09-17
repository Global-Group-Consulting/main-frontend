import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'
import Genders from '../enums/Genders'
import DocumentTypes from '../enums/DocumentTypes'

export default (context, inject) => {
  const enums = {
    PersonTypes,
    UserRoles,
    Genders,
    DocumentTypes
  }

  inject('enums', enums)

  if (!context.$enums) {
    context.$enums = enums
  }
}
