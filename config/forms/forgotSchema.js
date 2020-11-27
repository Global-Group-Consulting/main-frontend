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
    }
  ]
}
