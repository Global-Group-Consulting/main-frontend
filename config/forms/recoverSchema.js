export default function (context) {
  return [
    {
      cols: {
        'password': {
          component: "passwordInput",
          checkPasswordStrength: true,
          validations: {
            required: {},
            minLength: {params: 6}
          }
        },
      }
    }, {
      cols: {
        'password_confirmation': {
          component: "passwordInput",
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
