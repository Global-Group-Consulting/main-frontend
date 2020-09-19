import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'
import Genders from '../enums/Genders'
import DocumentTypes from '../enums/DocumentTypes'

export default (context, inject) => {
  const enums = {
    DocumentTypes,
    Genders,
    PersonTypes,
    UserRoles,
  }

  inject('enums', enums)

  if (!context.$enums) {
    context.$enums = enums
  }
}
