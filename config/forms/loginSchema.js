export default function (context) {
  return [
    {
      cols: {
        'email': {
          validations: {
            required: {},
            email: {}
          }
        },
      }
    },
    {
      cols: {
        'password': {
          validations: {
            required: {}
          }
        },
      }
    },
    {
      cols: {
        'role': {
          component: 'v-select',
          hint: 'SOLO PER DEMO !!',
          persistentHint: true,
          items: [
            ...context.$enums.UserRoles.list,
            {
              value: 5,
              text: 'cliente-new'
            }
          ].reduce((acc, item) => {
            if (item.text !== 'superAdmin') {
              acc.push({
                value: item.value,
                text: context.$t(`enums.UserRoles.${item.text}`),
              })
            }

            return acc
          }, [])
        },
      }
    }
  ]

}
