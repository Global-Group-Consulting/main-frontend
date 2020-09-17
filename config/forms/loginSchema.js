export default function () {
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
    }
  ]

}
