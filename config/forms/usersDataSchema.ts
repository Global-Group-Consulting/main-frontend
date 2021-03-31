import DocumentTypes from '@/enums/DocumentTypes'
import PersonTypes from '@/enums/PersonTypes'
import PaymentMethods from '@/enums/PaymentMethods'
import UserRoles from '../../enums/UserRoles'
import AgentTeamType from '../../enums/AgentTeamType'
import AccountStatuses from '../../enums/AccountStatuses'
import Genders from '@/enums/Genders'

import {computed} from '@vue/composition-api'
import moment from 'moment'

import ClubPacks from "@/enums/ClubPacks";
import {FormSchema} from "~/@types/FormSchema";
import {UserDataSchema} from "~/@types/UserFormData";
import {Permissions} from "~/@types/Permissions";
import {ClubPermissions} from "~/functions/acl/enums/club.permissions";

interface FormContext extends Vue {
  userIsPersonaGiuridica: boolean,
  userBusinessItaly: boolean,
  userBirthItaly: boolean,
  userLegalReprItaly: boolean,
  userIsNew: boolean,
  userRole: number
  showReferenceAgent: boolean
  permissions: Permissions
  formData: UserDataSchema
}

export function basicData(formContext: FormContext): FormSchema[] {
  const userIsAdmin = computed(() => [UserRoles.ADMIN || UserRoles.SERV_CLIENTI]
    .includes(+formContext.formData.role))

  return [
    {
      cols: {
        'personType': {
          component: userIsAdmin.value ? '' : 'v-select',
          formatter: userIsAdmin.value ? (value: any) => {
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
        'businessName': {
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica
            }
          }
        },
        'vatNumber': {
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica
            }
          }
        }
      }
    },
    {
      if: formContext.userIsPersonaGiuridica,
      legend: `business-residence`,
      cols: {
        'businessCountry': {
          component: 'v-select',
          items: 'enums.countriesList',
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica
            }
          }
        },
        'businessRegion': {
          component: 'v-select',
          items: 'enums.regionsList',
          if: formContext.userBusinessItaly,

        },
        'businessProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userBusinessItaly,
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica || formContext.userBusinessItaly
            }
          }
        },
        'businessCity': {
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica
            }
          }
        },
        'businessZip': {},
        'businessAddress': {
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica
            }
          }
        }
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
      legend: (formContext.userIsPersonaGiuridica ? 'legal-representative-' : '') + 'birth-data-legend',
      cols: {
        'birthCountry': {
          component: 'v-select',
          items: 'enums.countriesList'
        },
        'birthProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userBirthItaly,
          validations: {
            requiredIf: {
              params: () => formContext.userBirthItaly
            }
          }
        },
        'birthCity': {
          validations: {
            required: {}
          }
        },
        'birthDate': {
          'component': 'date-picker',
          max: moment().subtract(18, 'years').format('YYYY-MM-DD'),
          validations: {
            required: {}
          }
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
          if: formContext.userLegalReprItaly,
          validations: {
            requiredIf: {
              params: () => formContext.userBirthItaly
            }
          }
        },
        'legalRepresentativeCity': {
          validations: {
            required: {}
          }
        },
        'legalRepresentativeZip': {
          validations: {
            required: {}
          }
        },
        'legalRepresentativeAddress': {
          validations: {
            required: {}
          }
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
          // component: "phone-input",
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

export function agentData(formContext: FormContext) {
  const hasSubAgents = computed(() => formContext.formData.hasSubAgents)
  const isTeamLeader = computed(() => formContext.formData.hasSubAgents && !formContext.formData.referenceAgent)
  const canChangeCommissions = computed(() => {
    return formContext.permissions.superAdmin // deve essere modificabile solo dal superAdmin || formContext.$auth.user.hasSubAgents
  })

  return [
    {
      // legend: "agentCommissions",
      cols: {
        "agentTeamType": {
          component: "v-select",
          items: AgentTeamType,
          if: isTeamLeader.value,
          defaultValue: AgentTeamType.SUBJECT_PERCENTAGE,
          disabled: !formContext.permissions.superAdmin,
        },
      }
    },
    {
      cols: {
        "commissionsAssigned": {
          component: "agent-commissions-select",
          disabled: !canChangeCommissions.value,
          refAgent: formContext.formData.referenceAgentData
        },
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
export function contractData(formContext: FormContext) {
  const {userType} = formContext.permissions

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
          disabled: [AccountStatuses.APPROVED, AccountStatuses.ACTIVE, AccountStatuses.VALIDATED]
            .includes(formContext.formData.account_status),
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
          disabled: [AccountStatuses.APPROVED, AccountStatuses.ACTIVE, AccountStatuses.VALIDATED]
            .includes(formContext.formData.account_status),
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
          if: formContext.formData.contractInitialPaymentMethod === PaymentMethods.ALTRO,
          validations: {
            requiredIf: {
              params: () => formContext.formData.contractInitialPaymentMethod === PaymentMethods.ALTRO
            }
          }
        },
      }
    },

  ]
}

/**
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export function clubData(formContext: FormContext) {
  const gold = formContext.formData.gold
  const userIsNew = !formContext.formData.id
  const hasPermission = formContext.$acl.checkPermissions([ClubPermissions.CLUB_WRITE])
  const canChange = userIsNew || hasPermission

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
          disabled: !gold || !hasPermission,
          validations: {
            required: {}
          }
        }
      }
    }
  ]
}

/**
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export function extraData(formContext: FormContext) {
  const {changeRole, changeAgenteRif, userRole} = formContext.permissions
  const loggedUser = formContext.$auth.user
  const canChangeAgenteRif = computed(() => {
    return (formContext.userIsNew && userRole !== UserRoles.AGENTE)
      || (loggedUser.hasSubAgents && formContext.formData.id !== loggedUser.id)
      || changeAgenteRif
  })

  return [
    {
      disableEditMode: true,
      cols: {
        'role': {
          component: changeRole ? 'v-select' : '',
          formatter: changeRole ? 'numberCasting' :
            (value: string) => formContext.$i18n.t("enums.UserRoles." + UserRoles.getIdName(value)),
          items: changeRole ? formContext.userIsNew ? UserRoles : UserRoles.list.filter(_role => {
            const roleId = +UserRoles.get(_role.text).index
            const adminRoles = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI]

            if (adminRoles.includes(formContext.userRole)) {
              return adminRoles.includes(roleId)
            } else {
              return !adminRoles.includes(roleId)
            }
          })
            .map(entry => {
              entry.text = formContext.$i18n.t("enums.UserRoles." + entry.text) as string

              return entry
            }) : null,
          disabled: formContext.$auth.user.id === formContext.formData.id || !changeRole,
          validations: {
            required: {}
          }
        },
        'referenceAgent': {
          if: formContext.showReferenceAgent && canChangeAgenteRif.value,
          component: canChangeAgenteRif.value ? 'v-select' : null,
          disabled: !canChangeAgenteRif.value,
          clearable: true,
          formatter: !canChangeAgenteRif.value ? (value: string) => {
            if (!value) {
              return
            }

            const foundedUser = formContext.$store.getters.agentsList
              .find((_user: UserDataSchema) => _user.id.toString() === value.toString())

            if (!foundedUser) {
              return
            }

            return `${foundedUser.firstName} ${foundedUser.lastName}`

          } : null,
          items: !canChangeAgenteRif.value ? null : formContext.$store.getters.agentsList
            .reduce((acc: { text: string, value: string }[], curr: UserDataSchema, i: number, arr: UserDataSchema[]) => {
              if (+formContext.formData.role === UserRoles.AGENTE
                && curr.id === formContext.formData.id) {
                return acc
              }

              // Must add indentation based on subAgents structure
              let indentation = ""

              if (curr.referenceAgent) {
                let parent = arr.find((_el: UserDataSchema) => _el.id === curr.referenceAgent)

                indentation += "- "

                while (parent && parent.referenceAgent) {
                  indentation = "- " + indentation
                  // @ts-ignore
                  parent = arr.find((_el: UserDataSchema) => _el.id === parent.referenceAgent)
                }
              }

              acc.push({
                text: indentation + " " + curr.firstName + " " + curr.lastName,
                value: curr.id,
              })

              return acc
            }, [])
        },
        'referenceAgentData': {
          if: formContext.showReferenceAgent && !canChangeAgenteRif.value,
          disabled: true,
          formatter: (value: UserDataSchema) => {
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
  contractData,
  agentData,
  clubData,
  extraData
}
