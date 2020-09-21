export default function (context) {
  return [
    {
      cols: {
        walletType: {
          component: 'v-select',
          items: context.$enums.WalletTypes,
          if: [context.$enums.UserRoles.ADMIN,
            context.$enums.UserRoles.SERV_CLIENTI,
            context.$enums.UserRoles.AGENTE].includes(context.$auth.user.role)
        },
      }
    },
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
        currencyType: {
          component: 'v-select',
          items: context.$enums.CurrencyType
        },
      }
    },
    {
      cols: {
        availableAmount: {
          readonly: true,
          formatter: 'moneyFormatter'
        }
      }
    },
    {
      cols: {
        requestAmount: {
          formatter: 'moneyFormatter'
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
