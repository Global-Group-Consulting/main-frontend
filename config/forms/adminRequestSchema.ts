import {User, UserDataSchema} from "~/@types/UserFormData";
import RequestTypes from "~/enums/RequestTypes";
import {RequestFormData} from "~/@types/Requests";
import WalletTypes from "~/enums/WalletTypes";

interface FormContext extends Vue {
  dialogData: any,
  formData: RequestFormData,
  user: User

}

export default function (context: FormContext) {
  const availableRequests = [RequestTypes.RISC_CAPITALE, RequestTypes.RISC_INTERESSI,
    RequestTypes.RISC_INTERESSI_BRITE, RequestTypes.RISC_INTERESSI_GOLD,
    RequestTypes.VERSAMENTO, -1, RequestTypes.RISC_MANUALE_INTERESSI, RequestTypes.DEPOSIT_REPAYMENT]
  const goldRequests = [RequestTypes.RISC_INTERESSI_BRITE, RequestTypes.RISC_INTERESSI_GOLD]
  const classicRequests = [RequestTypes.RISC_INTERESSI]
  const userIsGold = context.user.gold || false
  const userIsSuperAdmin = context.$auth.user.superAdmin || false

  return [
    {
      cols: {
        type: {
          label: "requestType",
          component: 'v-select',
          items: availableRequests.reduce((acc: { value: number, text: string, divider?: boolean }[], el) => {
            const reqName = RequestTypes.getIdName(el)
    
            if (el === -1) {
              acc.push({
                value: -1,
                text: "--",
                divider: true
              })
              return acc
            }
    
            // if the user is not gold, avoid showing gold requests
            if (!userIsGold && goldRequests.includes(el)
              || userIsGold && classicRequests.includes(el)) {
              return acc
            }
    
            if ([RequestTypes.RISC_MANUALE_INTERESSI].includes(el) && !userIsSuperAdmin) {
              return acc
            }
    
            acc.push({
              value: el,
              text: context.$i18n.t(`enums.RequestTypes.${reqName}`) as string
            })
    
            return acc
          }, [])
        },
      }
    },
    {
      cols: {
        availableAmount: {
          disabled: true,
          component: 'money-input',
          currency: context.formData.currency
        }
      }
    },
    {
      cols: {
        amount: {
          label: "requestAmount",
          component: 'money-input',
          currency: context.formData.currency,
          maxValue: context.formData.availableAmount,
          validations: context.formData.autoWithdrawlAll ? {} : {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: [RequestTypes.VERSAMENTO, RequestTypes.DEPOSIT_REPAYMENT].includes(context.formData.type) ? null : context.formData.availableAmount || 0.5
            }
          }
        },
      }
    },
    {
      cols: {
        notes: {
          label: "requestNotes",
          component: 'v-textarea',
          autoGrow: true,
          rows: 1,
          validations: [RequestTypes.RISC_MANUALE_INTERESSI, RequestTypes.DEPOSIT_REPAYMENT].includes(context.formData.type) ? {
            required: {}
          } : {}
        }
      }
    },
  ]
}
