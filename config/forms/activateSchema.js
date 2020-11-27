export default function (context) {
  return [
    {
      cols: {
        'password': {
          validations: {
            required: {},
            minLength: { params: 6 }
          }
        },
      }
    }, {
      cols: {
        'password_confirmation': {
          validations: {
            sameAs: {
              params: 'password',
            }
          }
        },
      }
    }
  ]
}
