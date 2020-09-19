import { basicData, contactsData, addressData } from './usersData'

export default function (context) {
  return {
    'user-data': [
      ...basicData(context),
      ...addressData(context),
      ...contactsData(context)
    ],
    'attachments': [
      {
        cols: {
          'docFront': {
            component: 'v-file-input'
          },
          'docBack': {
            component: 'v-file-input',
          },
          'docPayment': {
            component: 'v-file-input',
          },
        }
      }
    ],
    'contract-sign': [
      {
        cols: {
          'otp': {
            component: 'contract-sign',
          }
        }

      }
    ]
  }
}
