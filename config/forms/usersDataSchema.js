import DocumentTypes from '@/enums/DocumentTypes'
import PersonTypes from '@/enums/PersonTypes'
import UserRoles from '../../enums/UserRoles'
import AccountStatuses from '../../enums/AccountStatuses'
import Genders from '@/enums/Genders'

import axios from "@nuxtjs/axios"

import { computed } from '@vue/composition-api'
import moment from 'moment'

/**
 * @typedef {import('../../@types/UserFormSchemaContext').UserFormSchemaContext} FormContext
 */

/**
 * @typedef {import('../../@types/FormSchema').FormSchema} FormSchema
 */


/**
 *
 * @param {FormContext} formContext
 */
export function basicData(formContext) {
  const userIsAdmin = computed(() => [UserRoles.ADMIN || UserRoles.SERV_CLIENTI].includes(+formContext.formData.role))

  return [
    {
      cols: {
        'personType': {
          component: userIsAdmin.value ? '' : 'v-select',
          formatter: userIsAdmin.value ? (value) => {
            return formContext.$i18n.t("enums.PersonTypes." + PersonTypes.getIdName(value))
          } : 'numberCasting',
          items: PersonTypes,
          disabled: userIsAdmin.value,
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
        },
        'docAttachment': {
          component: "file-uploader",
          files: formContext.formData.files
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
 * This section won't be visible to admin users
 *
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export function contractData(formContext) {
  return [
    {
      cols: {
        'contractNumber': {
          disabled: true,
          if: !formContext.userIsNew
        },
        'contractNumberLegacy': {
          // disabled: true
        },
        'contractDate': {
          disabled: true,
          if: !formContext.userIsNew,
        },
        'contractPercentage': {
          type: "number",
          formatter: "percentageFormatter",
          appendIcon: "mdi-percent",
          validations: {
            required: {},
            minValue: {
              params: 0.5
            },
            maxValue: {
              params: 50
            }
          }
        },
      }
    },
    {
      cols: {
        'contractIban': {},
        'contractBic': {}
      }
    },
    {
      cols: {
        'contractInitialInvestment': {
          disabled: [AccountStatuses.APPROVED, AccountStatuses.ACTIVE, AccountStatuses.VALIDATED].includes(formContext.formData.account_status),
          // formatter: "moneyFormatter"
          component: "money-input",
          validations: {
            required: {},
            minValue: {
              params: 1
            }
          }
        },
        'contractInvestmentAttachment': {
          component: "file-uploader",
          files: formContext.formData.files
        },
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export function extraData(formContext) {
  const { changeRole, changeAgenteRif, userRole } = formContext.permissions

  return [
    {
      disableEditMode: true,
      cols: {
        'role': {
          component: changeRole ? 'v-select' : '',
          formatter: changeRole ? 'numberCasting' :
            (value) => formContext.$i18n.t("enums.UserRoles." + UserRoles.getIdName(value)),
          items: changeRole ? formContext.userIsNew ? UserRoles : UserRoles.list.filter(_role => {
            const roleId = +UserRoles.get(_role.text).index
            const adminRoles = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI]

            if (adminRoles.includes(formContext.userRole)) {
              return adminRoles.includes(roleId)
            } else {
              return !adminRoles.includes(roleId)
            }
          }).map(entry => {
            entry.text = formContext.$i18n.t("enums.UserRoles." + entry.text)

            return entry
          }) : null,
          disabled: formContext.$auth.user.id === this.formData.id || !changeRole,
          validations: {
            required: {}
          }
        },
        'referenceAgent': {
          if: formContext.showReferenceAgent && changeAgenteRif,
          component: changeAgenteRif ? 'v-select' : null,
          disabled: !changeAgenteRif,
          clearable: true,
          formatter: !changeAgenteRif ? (value) => {
            if (!value) {
              return
            }

            const foundedUser = formContext.$store.getters.agentsList.find(_user => _user.id.toString() === value.toString())

            if (!foundedUser) {
              return
            }

            return `${foundedUser.firstName} ${foundedUser.lastName}`

          } : null,
          items: !changeAgenteRif ? null : formContext.$store.getters.agentsList
            .reduce((acc, curr) => {
              if (+formContext.formData.role === UserRoles.AGENTE
                && curr.id === formContext.formData.id) {
                return acc
              }

              acc.push({
                text: curr.firstName + " " + curr.lastName,
                value: curr.id,
              })

              return acc
            }, [])
        },
        'referenceAgentData': {
          if: formContext.showReferenceAgent && !changeAgenteRif,
          disabled: true,
          formatter: (value) => {
            if (!value) {
              return
            }

            return `${value.firstName} ${value.lastName}`

          }
        }
      }
    },
    {
      if: !formContext.userIsNew,
      disableEditMode: true,
      cols: {
        'created_at': {
          disabled: true,
          formatter: 'dateHourFormatter'
        },
        'updated_at': {
          disabled: true,
          formatter: 'dateHourFormatter'
        },
        'activated_at': {
          disabled: true,
          formatter: 'dateHourFormatter'
        },
        'validated_at': {
          disabled: true,
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
