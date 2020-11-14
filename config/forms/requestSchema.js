/**
 * @typedef ComputedContext
 * @property { typeof import("../../plugins/enums").enums } $enums
 * @property {} $i18n
 * @property { {} } formData
 * @property { {data : {type: number}, readonly: boolean} } dialogData
 */

/**
 * 
 * @param {ComputedContext} context 
 * @returns {import("../../@types/FormSchema").FormSchema[]}
 */
export default function (context) {
  const isVersamento = context.dialogData && context.dialogData.data?.type === context.$enums.RequestTypes.VERSAMENTO
  const isNew = !context.formData.id
  const readonly = context.dialogData.readonly

  return [
    {
      cols: {
        type: {
          label: "requestType",
          if: (!readonly && !isVersamento) || readonly,
          component: !readonly ? 'v-select' : null,
          disabled: readonly,
          formatter: readonly ? (value) => context.$i18n.t(`enums.RequestTypes.${context.$enums.RequestTypes.getIdName(value)}`) : null,
          items: !readonly ? context.$enums.RequestTypes.list.reduce((acc, type) => {
            let mustHide = false

            if (type.value === context.$enums.RequestTypes.VERSAMENTO ||
              (type.value === context.$enums.RequestTypes.INTERESSI &&
                context.$auth.user.role !== context.$enums.UserRoles.AGENTE)
            ) {
              mustHide = true
            }

            if (!mustHide) {
              type.text = context.$i18n.t(`enums.RequestTypes.${type.text}`)

              acc.push(type)
            }

            return acc
          }, []) : null
        },
      }
    },
    {
      cols: {
        wallet: {
          label: "walletType",
          component: !readonly ? 'v-select' : null,
          items: context.$enums.WalletTypes,
          disabled: context.formData.type === context.$enums.RequestTypes.VERSAMENTO || readonly,
          formatter: readonly ? (value) => context.$i18n.t(`enums.WalletTypes.${context.$enums.WalletTypes.getIdName(value)}`) : null,
          if: [context.$enums.UserRoles.ADMIN,
          context.$enums.UserRoles.SERV_CLIENTI,
          context.$enums.UserRoles.AGENTE].includes(context.$auth.user.role)
        },
      }
    },
    {
      cols: {
        currency: {
          label: "currencyType",
          if: (!readonly && !isVersamento) || readonly,
          component: !readonly ? 'v-select' : null,
          formatter: readonly ? (value) => context.$i18n.t(`enums.CurrencyType.${context.$enums.CurrencyType.getIdName(value)}`) : null,
          items: context.$enums.CurrencyType,
          disabled: context.formData.type === context.$enums.RequestTypes.VERSAMENTO || readonly,
        },
      }
    },
    {
      cols: {
        availableAmount: {
          disabled: true,
          component: 'money-input',
          currency: context.formData.currency,
          if: (!readonly && !isVersamento) || readonly
        }
      }
    },
    {
      cols: {
        amount: {
          label: "requestAmount",
          component: 'money-input',
          disabled: readonly,
          currency: context.formData.currency,
          showMax: context.formData.wallet === 2,
          maxValue: context.formData.availableAmount,
          validations: {
            required: {}
          }
        },
      }
    },
    {
      cols: {
        created_at: {
          label: "requestCreatedAt",
          component: 'date-picker',
          if: !isNew,
          disabled: true,
          "prepend-icon": "",
          "prepend-inner-icon": "mdi-calendar",
        },
      }
    },
    {
      cols: {
        requestAttachment: {
          component: 'file-uploader',
          "prepend-icon": "",
          "prepend-inner-icon": "$file",
          if: isVersamento,
          disabled: readonly,
          files: context.formData.files,
          validations: isVersamento ? {
            required: {}
          } : null
        },
      }
    },
    {
      cols: {
        notes: {
          label: "requestNotes",
          component: 'v-textarea',
          autoGrow: true,
          disabled: readonly,
          rows: 1
        }
      }
    }
  ]
}
