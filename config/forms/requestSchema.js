export default function (context) {
  return [
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
        requestType: {
          component: 'v-select',
          items: context.$enums.RequestTypes
        },
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
          component: 'date-picker'
          // if: [context.$enums.UserRoles.ADMIN, context.$enums.UserRoles.SERV_CLIENTI].includes(context.$auth.user.role)
        },
      }
    },
    {
      cols: {
        requestAttachment: {
          component: 'v-file-input',
          if: context.formData.requestType === context.$enums.RequestTypes.VERSAMENTO
        },
      }
    },
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
