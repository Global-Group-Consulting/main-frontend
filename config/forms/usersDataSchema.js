import DocumentTypes from '@/enums/DocumentTypes'
import PersonTypes from '@/enums/PersonTypes'
import PaymentMethods from '@/enums/PaymentMethods'
import UserRoles from '../../enums/UserRoles'
import AccountStatuses from '../../enums/AccountStatuses'
import Genders from '@/enums/Genders'

import axios from "@nuxtjs/axios"
import {required, requiredIf} from 'vuelidate/lib/validators'

import {computed} from '@vue/composition-api'
import moment from 'moment'
import permissions from "@/functions/permissions";
import ClubPacks from "@/enums/ClubPacks";

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
      if: formContext.userIsPersonaGiuridica,
      legend: `business-residence`,
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
      legend: formContext.userIsPersonaGiuridica ? 'legal-representative' : '',
      cols: {
        'firstName': {
          validations: {
            requiredIf: {
              params: () => !formContext.userIsPersonaGiuridica
            }
          }
        },
        'lastName': {
          validations: {
            requiredIf: {
              params: () => !formContext.userIsPersonaGiuridica
            }
          }
        },
        'fiscalCode': {
          validations: {
            requiredIf: {
              params: () => !formContext.userIsPersonaGiuridica
            }
          }
        },
        'gender': {
          component: 'v-select',
          items: Genders
        }
      }
    },
    {
      legend: (formContext.userIsPersonaGiuridica ? 'legal-representative-' : '') + 'birth-data-legend',
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
          max: moment().subtract(18, 'years').format('YYYY-MM-DD')
        }
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
    },
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
        'mobile': {
          validations: {
            required: {},
            phoneNumber: {}
          }
        },
        'phone': {
          validations: {
            phoneNumber: {}
          }
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
      legend: `business-residence`,
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
        'mobile': {
          validations: {
            required: {},
            phoneNumber: {}
          }
        },
        'phone': {
          validations: {
            phoneNumber: {}
          }
        }
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
  const {changeRole, changeAgenteRif, userRole, userType} = formContext.permissions

  return [
    {
      cols: {
        'contractNumber': {
          disabled: true,
          formatter: 'contractNumberFormatter',
          if: !formContext.userIsNew
        },
        'contractNumberLegacy': {
          disabled: userType !== "admin",
          // disabled: true
        },
        'contractSignedAt': {
          disabled: true,
          formatter: 'dateHourFormatter',
          if: !formContext.userIsNew && formContext.formData.contractSignedAt,
        },
        'contractPercentage': {
          type: "number",
          formatter: "percentageFormatter",
          appendIcon: "mdi-percent",
          disabled: userType !== "admin" && !formContext.userIsNew,
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
      if: !formContext.userIsNew && formContext.formData.contractSignedAt,
      cols: {
        'contractDoc': {
          component: "contract-doc",
          signinLogs: formContext.formData.signinLogs,
          files: formContext.formData.contractFiles,
          previewOnly: true
        },
        'contractDocSignLog': {
          component: "contract-doc",
          files: formContext.formData.contractFiles,
          previewOnly: true
        }
      }
    },
    {
      cols: {
        'contractIban': {},
        'contractBic': {}
      }
    },
    {
      legend: "initial-investment-legend",
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
        'contractInitialInvestmentGold': {
          disabled: [AccountStatuses.APPROVED, AccountStatuses.ACTIVE, AccountStatuses.VALIDATED].includes(formContext.formData.account_status),
          type: "number",
          prefix: "gr.",
          validations: {
            minValue: {
              params: 1
            }
          }
        },
        'contractInvestmentAttachment': {
          component: "file-uploader",
          files: formContext.formData.files
        },
      },
    },
    {
      cols: {
        'contractInitialPaymentMethod': {
          component: "v-select",
          items: PaymentMethods,
          validations: {
            required: {}
          }
        },
        'contractInitialPaymentMethodOther': {
          if: formContext.formData.contractInitialPaymentMethod === PaymentMethods.ALTRO
        },
      }
    },
    {
      if: formContext.formData.role === UserRoles.AGENTE,
      legend: "agentCommissions",
      cols: {
        "commissionsAssigned": {
          component: "agent-commissions-select",
          disabled: !formContext.permissions.superAdmin,
        },
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export function clubData(formContext) {
  const gold = formContext.formData.gold
  const canChange = formContext.$auth.user.role === UserRoles.ADMIN

  return [
    {
      cols: {
        'gold': {
          component: "v-switch",
          falseValue: false,
          disabled: !canChange,
          inputValue: formContext.formData.gold
        }
      }
    }, {
      cols: {
        'clubCardNumber': {
          type: "number",
          disabled: !gold || !canChange
        },
        'clubPack': {
          component: "v-select",
          items: ClubPacks,
          disabled: !gold || !canChange
        }
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export function extraData(formContext) {
  const {changeRole, changeAgenteRif, userRole} = formContext.permissions
  const canChangeAgenteRif = computed(() => {
    return (formContext.userIsNew && userRole !== UserRoles.AGENTE) ||
      changeAgenteRif
  })

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
          if: formContext.showReferenceAgent && canChangeAgenteRif.value,
          component: canChangeAgenteRif.value ? 'v-select' : null,
          disabled: !canChangeAgenteRif.value,
          clearable: true,
          formatter: !canChangeAgenteRif.value ? (value) => {
            if (!value) {
              return
            }

            const foundedUser = formContext.$store.getters.agentsList.find(_user => _user.id.toString() === value.toString())

            if (!foundedUser) {
              return
            }

            return `${foundedUser.firstName} ${foundedUser.lastName}`

          } : null,
          items: !canChangeAgenteRif.value ? null : formContext.$store.getters.agentsList
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
          if: formContext.showReferenceAgent && !canChangeAgenteRif.value,
          disabled: true,
          formatter: (value) => {
            if (!value) {
              return
            }
            if (value.id === formContext.$auth.user.id) {
              return formContext.$i18n.t("forms.reference-agent-you")
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
        /*  'activated_at': {
           disabled: true,
           formatter: 'dateHourFormatter'
         },
         'validated_at': {
           disabled: true,
           formatter: 'dateHourFormatter'
         }, */
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
  clubData,
  extraData
}
