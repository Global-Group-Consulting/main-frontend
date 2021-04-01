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
          "data-lpignore": "true",
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
