import DocumentTypes from '@/enums/DocumentTypes'
import PersonTypes from '@/enums/PersonTypes'
import PaymentMethods from '@/enums/PaymentMethods'
import UserRoles from '../../enums/UserRoles'
import AgentTeamType from '../../enums/AgentTeamType'
import AccountStatuses from '../../enums/AccountStatuses'
import Genders from '@/enums/Genders'

import { computed } from '@vue/composition-api'
import moment from 'moment'

import ClubPacks from '@/enums/ClubPacks'
import { FormSchema } from '~/@types/FormSchema'
import { UserDataSchema } from '~/@types/UserFormData'
import { Permissions } from '~/@types/Permissions'
import { ClubPermissions } from '~/functions/acl/enums/club.permissions'

interface FormContext extends Vue {
  userIsPersonaGiuridica: boolean,
  userBusinessItaly: boolean,
  userBirthItaly: boolean,
  userLegalReprItaly: boolean,
  userIsNew: boolean,
  userRole: number
  showReferenceAgent: boolean
  beforeConfirm: boolean
  permissions: Permissions
  formData: UserDataSchema
}

function isRequired (formContext: FormContext): boolean {
  const isNew = !formContext.formData.id
  const accountStatus = formContext.formData.account_status
  const userRole = formContext.formData.role
  const beforeConfirm = formContext.beforeConfirm
  
  /*
  Required = false se
  - account_status === BOZZA -o- isNew
    E
    - NOT beforeConfirm

  OPPURE
  - userRole è amministrativo
   */
  return !(((accountStatus === AccountStatuses.DRAFT || isNew) && !beforeConfirm)
    || [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole))
}

export function basicData (formContext: FormContext): FormSchema[] {
  const userIsAdmin = computed(() => [UserRoles.ADMIN || UserRoles.SERV_CLIENTI]
    .includes(+formContext.formData.role))
  
  return [
    {
      cols: {
        'personType': {
          // component: userIsAdmin.value ? '' : 'v-select',
          /*formatter: userIsAdmin.value ? (value: any) => {
            return formContext.$i18n.t('enums.PersonTypes.' + PersonTypes.getIdName(value))
          } : 'numberCasting',*/
          formatter: (value: any) => {
            return formContext.$i18n.t('enums.PersonTypes.' + PersonTypes.getIdName(value))
          },
          // items: PersonTypes,
          disabled: true,
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
              params: () => formContext.userIsPersonaGiuridica && isRequired(formContext)
            }
          }
        },
        'businessRegion': {
          component: 'v-select',
          items: 'enums.regionsList',
          if: formContext.userBusinessItaly
        },
        'businessProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userBusinessItaly,
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica && formContext.userBusinessItaly && isRequired(formContext)
            }
          }
        },
        'businessCity': {
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica && isRequired(formContext)
            }
          }
        },
        'businessZip': {},
        'businessAddress': {
          validations: {
            requiredIf: {
              params: () => formContext.userIsPersonaGiuridica && isRequired(formContext)
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
            requiredIf: {
              params: () => isRequired(formContext)
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
          items: 'enums.countriesList',
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
        },
        'birthProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: formContext.userBirthItaly,
          validations: {
            requiredIf: {
              params: () => formContext.userBirthItaly && isRequired(formContext)
            }
          }
        },
        'birthCity': {
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
        },
        'birthDate': {
          'component': 'date-picker',
          max: moment().subtract(13, 'years').format('YYYY-MM-DD'),
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
        }
      }
    },
    {
      legend: (formContext.userIsPersonaGiuridica ? `${formContext.userIsPersonaGiuridica ? 'legal-representative-' : ''}` : '') + 'residence',
      cols: {
        'legalRepresentativeCountry': {
          component: 'v-select',
          items: 'enums.countriesList',
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
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
              params: () => formContext.userLegalReprItaly && isRequired(formContext)
            }
          }
        },
        'legalRepresentativeCity': {
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
        },
        'legalRepresentativeZip': {
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
        },
        'legalRepresentativeAddress': {
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
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
          component: 'file-uploader',
          files: formContext.formData.files
        }
      }
    },
    {
      legend: 'contacts',
      cols: {
        'email': {
          disabled: !formContext.userIsNew && (formContext.formData.account_status !== AccountStatuses.DRAFT && !formContext.$auth.user.superAdmin),
          validations: {
            required: {},
            email: {}
          }
        },
        'mobile': {
          // component: "phone-input",
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            },
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

export function agentData (formContext: FormContext) {
  const hasSubAgents = computed(() => formContext.formData.hasSubAgents)
  const isTeamLeader = computed(() => formContext.formData.hasSubAgents && !formContext.formData.referenceAgent)
  const canChangeCommissions = computed(() => {
    return formContext.permissions.superAdmin // deve essere modificabile solo dal superAdmin || formContext.$auth.user.hasSubAgents
  })
  
  return [
    {
      // legend: "agentCommissions",
      cols: {
        'agentTeamType': {
          component: 'v-select',
          items: AgentTeamType,
          if: isTeamLeader.value,
          defaultValue: AgentTeamType.SUBJECT_PERCENTAGE,
          disabled: !formContext.permissions.superAdmin
        }
      }
    },
    {
      cols: {
        'commissionsAssigned': {
          component: 'agent-commissions-select',
          disabled: !canChangeCommissions.value,
          refAgent: formContext.formData.referenceAgentData,
          agentTeamType: formContext.formData.agentTeamType
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
export function contractData (formContext: FormContext) {
  const userType = formContext.permissions?.userType
  
  return [
    {
      cols: {
        'contractNumber': {
          disabled: true,
          formatter: 'contractNumberFormatter',
          if: !formContext.userIsNew
        },
        'contractNumberLegacy': {
          disabled: userType !== 'admin'
          // disabled: true
        },
        'contractSignedAt': {
          disabled: true,
          formatter: 'dateHourFormatter',
          if: !formContext.userIsNew && formContext.formData.contractSignedAt
        },
        'contractPercentage': {
          type: 'number',
          formatter: 'percentageFormatter',
          appendIcon: 'mdi-percent',
          disabled: userType !== 'admin' && !formContext.userIsNew,
          validations: {
            required: {},
            minValue: {
              params: 0.5
            },
            maxValue: {
              params: 50
            }
          }
        }
      }
    },
    {
      if: !formContext.userIsNew && formContext.formData.contractSignedAt,
      cols: {
        'contractDoc': {
          component: 'contract-doc',
          userId: formContext.formData.id,
          // signinLogs: formContext.formData.signinLogs,
          files: formContext.formData.contractFiles,
          contractImported: formContext.formData.contractImported,
          previewOnly: true
        },
        'contractDocSignLog': {
          component: 'contract-doc',
          files: formContext.formData.contractFiles,
          previewOnly: true,
          if: !formContext.formData.contractImported
        },
        'contractTermsCondition': {
          component: 'contract-terms-condition',
          previewOnly: true,
          contractPercentage: formContext.formData.contractPercentage?.toString()
        }
      }
    },
    {
      cols: {
        'contractIban': {},
        'contractBic': {},
        'contractNotes': {
          component: 'v-textarea',
          rows: 1,
          autoGrow: true,
          disabled: userType !== 'admin',
          hint: userType !== 'admin' ? 'contract-notes-hint' : '',
          persistentHint: userType !== 'admin'
        }
      }
    },
    {
      legend: 'initial-investment-legend',
      cols: {
        'contractInitialInvestment': {
          disabled: [AccountStatuses.APPROVED, AccountStatuses.ACTIVE, AccountStatuses.VALIDATED]
            .includes(formContext.formData.account_status),
          // formatter: "moneyFormatter"
          component: 'money-input',
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            },
            minValue: {
              params: formContext.formData.role === UserRoles.AGENTE ? 0 : 1
            }
          }
        },
        'contractInitialInvestmentGold': {
          disabled: [AccountStatuses.APPROVED, AccountStatuses.ACTIVE, AccountStatuses.VALIDATED]
            .includes(formContext.formData.account_status),
          type: 'number',
          prefix: 'gr.',
          validations: {
            minValue: {
              params: formContext.formData.role === UserRoles.AGENTE ? 0 : 1
            }
          }
        },
        'contractInvestmentAttachment': {
          component: 'file-uploader',
          files: formContext.formData.files
        }
      }
    },
    {
      cols: {
        'contractInitialPaymentMethod': {
          component: 'v-select',
          items: PaymentMethods,
          validations: {
            requiredIf: {
              params: () => isRequired(formContext)
            }
          }
        },
        'contractInitialPaymentMethodOther': {
          if: formContext.formData.contractInitialPaymentMethod === PaymentMethods.ALTRO,
          validations: {
            requiredIf: {
              params: () => formContext.formData.contractInitialPaymentMethod === PaymentMethods.ALTRO && isRequired(formContext)
            }
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
export function clubData (formContext: FormContext): FormSchema[] {
  const gold = formContext.formData.gold
  const userIsNew = !formContext.formData.id
  const hasPermission = formContext.$acl.checkPermissions([ClubPermissions.CLUB_WRITE])
  const canChange = userIsNew || (hasPermission && formContext.formData.id !== formContext.$auth.user.id)
  
  return [
    {
      cols: {
        'gold': {
          component: 'v-switch',
          falseValue: false,
          disabled: !canChange,
          inputValue: formContext.formData.gold
        }
      }
    }, {
      cols: {
        'clubCardNumber': {
          disabled: !gold || !canChange
        },
        'clubPack': {
          component: 'v-select',
          items: ClubPacks,
          disabled: !gold || !canChange,
          validations: {
            required: {
              params: () => formContext.formData.gold && hasPermission && isRequired(formContext)
            }
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
export function extraData (formContext: FormContext) {
  const { changeRole, changeAgenteRif, userRole } = formContext.permissions
  const loggedUser = formContext.$auth.user
  const canChangeAgenteRif = computed(() => {
    return (formContext.userIsNew && userRole !== UserRoles.AGENTE)
      || (loggedUser.hasSubAgents && formContext.formData.id !== loggedUser.id && formContext.formData.account_status === AccountStatuses.DRAFT)
      || changeAgenteRif
  })
  
  return [
    {
      disableEditMode: true,
      cols: {
        'role': {
          component: changeRole ? 'v-select' : '',
          formatter: changeRole ? 'numberCasting' :
            (value: string) => formContext.$i18n.t('enums.UserRoles.' + UserRoles.getIdName(value)),
          items: changeRole ? formContext.userIsNew ? UserRoles : UserRoles.list.filter(_role => {
            const roleId = +(UserRoles.get(_role.text).index || -1)
            const adminRoles = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI]
            
            if (adminRoles.includes(formContext.userRole)) {
              return adminRoles.includes(roleId)
            } else {
              return !adminRoles.includes(roleId)
            }
          })
            .map(entry => {
              entry.text = formContext.$i18n.t('enums.UserRoles.' + entry.text) as string
              
              return entry
            }) : null,
          disabled: formContext.$auth.user.id === formContext.formData.id || !changeRole,
          validations: {
            required: {}
          }
        },
        'referenceAgent': {
          if: formContext.showReferenceAgent && canChangeAgenteRif.value,
          component: canChangeAgenteRif.value ? 'async-autocomplete' : null,
          disabled: !canChangeAgenteRif.value,
          clearable: true,
          asyncFn: formContext.$apiCalls.selectOptions.getAgentsList,
          items: formContext.formData.referenceAgentData ? [{
            rawData: formContext.formData.referenceAgentData,
            text: formContext.formData.referenceAgentData.firstName + ' ' + formContext.formData.referenceAgentData.lastName,
            value: formContext.formData.referenceAgentData.id
          }] : []
          /*formatter: !canChangeAgenteRif.value ? (value: string) => {
            if (!value) {
              return
            }
            
            const foundedUser = formContext.$store.getters.agentsList?.find((_user: UserDataSchema) => _user.id.toString() === value.toString())
            
            if (!foundedUser) {
              return
            }
            
            return `${foundedUser.firstName} ${foundedUser.lastName}`
            
          } : null,
          items: !canChangeAgenteRif.value || !formContext.$store.getters.agentsList ? null : formContext.$store.getters.agentsList?.reduce((acc: { text: string, value: string }[], curr: UserDataSchema, i: number, arr: UserDataSchema[]) => {
              if (+formContext.formData.role === UserRoles.AGENTE
                && curr._id === formContext.formData.id) {
                return acc
              }
              
              // Must add indentation based on subAgents structure
              let indentation = ''
              
              if (curr.referenceAgent) {
                let parent = arr.find((_el: UserDataSchema) => _el.id === curr.referenceAgent)
                
                indentation += '- '
                
                while (parent && parent.referenceAgent) {
                  indentation = '- ' + indentation
                  // @ts-ignore
                  parent = arr.find((_el: UserDataSchema) => _el.id === parent.referenceAgent)
                }
              }
              
              acc.push({
                text: indentation + ' ' + curr.firstName + ' ' + curr.lastName,
                value: curr._id
              })
              
              return acc
            }, [])*/
        },
        'referenceAgentData': {
          if: formContext.showReferenceAgent && !canChangeAgenteRif.value,
          disabled: true,
          formatter: (value: UserDataSchema) => {
            if (!value) {
              return
            }
            if (value.id === formContext.$auth.user.id) {
              return formContext.$i18n.t('forms.reference-agent-you')
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
        }
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
