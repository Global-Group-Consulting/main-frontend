import DocumentTypes from '@/enums/DocumentTypes'
import PersonTypes from '@/enums/PersonTypes'
import UserRoles from '@/enums/UserRoles'
import Genders from '@/enums/Genders'

import moment from 'moment'

/**
 * @typedef FormContext
 *
 * @property {Boolean} userIsNew
 * @property {Number} userRole
 * @property {Boolean} userIsPersonaGiuridica
 * @property {Boolean} userBirthItaly
 * @property {Boolean} userBusinessItaly
 * @property {Boolean} userLegalReprItaly
 * @property {Boolean} showReferenceAgent
 */

/**
 *
 * @param {FormContext} formContext
 */
export function basicData(formContext) {
  return [
    {
      cols: {
        'personType': {
          component: 'v-select',
          disabled: formContext.userCheckingData,
          items: PersonTypes,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      if: formContext.userIsPersonaGiuridica,
      cols: {
        'businessName': {},
        'vatNumber': {}
      }
    },
    {
      legend: formContext.userIsPersonaGiuridica ? 'legal-representative' : '',
      cols: {
        'firstName': {
          validations: {
            required: {}
          }
        },
        'lastName': {
          validations: {
            required: {}
          }
        },
        'fiscalCode': {
          validations: {
            required: {}
          }
        },
        'gender': {
          component: 'v-select',
          items: Genders
        }
      }
    },
    {
      legend: (formContext.userIsPersonaGiuridica ? 'legal-representative-' : '') + 'birth-date',
      cols: {
        'birthCountry': {
          component: 'v-select',
          items: 'enums.countriesList'
        },
        'birthProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userBirthItaly
        },
        'birthCity': {},
        'birthDate': {
          'component': 'date-picker',
          'initial-date': moment().subtract(18, 'years').format('YYYY-MM-DD')
        }
      }
    },
    {
      legend: 'identity-docs',
      cols: {
        'docType': {
          component: 'v-select',
          items: DocumentTypes
        },
        'docNumber': {},
        'docExpiration': {
          'component': 'date-picker',
          'min': moment().format('YYYY-MM-DD')
        }

      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 */
export function addressData(formContext) {
  return [
    {
      if: formContext.userIsPersonaGiuridica,
      cols: {
        'businessCountry': {
          component: 'v-select',
          items: 'enums.countriesList'
        },
        'businessRegion': {
          component: 'v-select',
          items: 'enums.regionsList',
          if: formContext.userBusinessItaly
        },
        'businessProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userBusinessItaly
        },
        'businessCity': {},
        'businessZip': {},
        'businessAddress': {}
      }
    },
    {
      legend: (formContext.userIsPersonaGiuridica ? `${formContext.userIsPersonaGiuridica ? 'legal-representative-' : ''}` : '') + 'residence',
      cols: {
        'legalRepresentativeCountry': {
          component: 'v-select',
          items: 'enums.countriesList'
        },
        'legalRepresentativeRegion': {
          component: 'v-select',
          items: 'enums.regionsList',
          if: formContext.userLegalReprItaly
        },
        'legalRepresentativeProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userLegalReprItaly
        },
        'legalRepresentativeCity': {},
        'legalRepresentativeZip': {},
        'legalRepresentativeAddress': {}
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 */
export function contactsData(formContext) {
  return [
    {
      legend: 'contacts',
      cols: {
        'email': {
          disabled: !formContext.userIsNew,
          validations: {
            required: {},
            email: {}
          }
        },
        'mobile': {},
        'phone': {}
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 */
export function contractData(formContext) {
  return [
    {
      cols: {
        'contractNumber': {
          disabled: true,
          if: !formContext.userIsNew
        },
        'contractDate': {
          if: !formContext.userIsNew
        },
        'contractPercentage': {},
        'contractIban': {},
        'contractBic': {}
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 */
export function extraData(formContext) {
  return [
    {
      cols: {
        'role': {
          component: 'v-select',
          items: UserRoles,
          disabled: formContext.$auth.user.id === this.formData.id,
          validations: {
            required: {}
          }
        },
        'referenceAgent': {
          if: formContext.showReferenceAgent
        }
      }
    },
    {
      if: !formContext.userIsNew,
      cols: {
        'accountCreatedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
        'accountUpdatedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
        'accountActivatedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
        'accountVerifiedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 */
export default {
  basicData,
  addressData,
  contactsData,
  contractData,
  extraData
}
