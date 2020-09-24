export default function (context) {
  return [
    {
      cols: {
        requestType: {
          component: 'v-select',
          items: context.$enums.RequestTypes
        },
      }
    },
    {
      cols: {
        walletType: {
          component: 'v-select',
          items: context.$enums.WalletTypes,
          disabled: context.formData.requestType === context.$enums.RequestTypes.VERSAMENTO,
          if: [context.$enums.UserRoles.ADMIN,
            context.$enums.UserRoles.SERV_CLIENTI,
            context.$enums.UserRoles.AGENTE].includes(context.$auth.user.role)
        },
      }
    },
    {
      cols: {
        currencyType: {
          component: 'v-select',
          items: context.$enums.CurrencyType,
          disabled: context.formData.requestType === context.$enums.RequestTypes.VERSAMENTO,
        },
      }
    },
    {
      cols: {
        availableAmount: {
          readonly: true,
          component: 'money-input',
          currency: context.formData.currencyType,
          if: context.formData.requestType !== context.$enums.RequestTypes.VERSAMENTO
        }
      }
    },
    {
      cols: {
        requestAmount: {
          component: 'money-input',
          currency: context.formData.currencyType,
          showMax: context.formData.walletType === 2,
          maxValue: context.formData.availableAmount
        },
      }
    },
    {
      cols: {
        requestDate: {
          component: 'date-picker',
          if: [context.$enums.UserRoles.ADMIN, context.$enums.UserRoles.SERV_CLIENTI].includes(context.$auth.user.role)
        },
      }
    },
    /*{
      cols: {
        requestAttachment: {
          component: 'v-file-input',
          if: context.formData.requestType === context.$enums.RequestTypes.VERSAMENTO
        },
      }
    },*/
    {
      cols: {
        requestNotes: {
          component: 'v-textarea',
          autoGrow: true,
          rows: 1
        }
      }
    }
  ]
}
