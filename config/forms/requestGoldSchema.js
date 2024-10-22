/**
 * @typedef ComputedContext
 * @property { typeof import('../../plugins/enums').enums } $enums
 * @property {} $i18n
 * @property { {} } formData
 * @property { {data : {type: number}, readonly: boolean} } dialogData
 */

import CryptoCurrency from '~/enums/CryptoCurrency'
import CurrencyType from '~/enums/CurrencyType'

/**
 *
 * @param {ComputedContext} context
 * @returns {import('../../@types/FormSchema').FormSchema[]}
 */
function goldSchema (context) {
  return [
    {
      maxCols: 2,
      cols: {
        availableAmount: {
          component: 'money-input',
          disabled: true,
          showBrite: false
        },
        requestAmount: {
          component: 'money-input',
          showBrite: false,
          maxValue: context.formData.availableAmount,
          validations: {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: context.formData.availableAmount
            }
          }
        }
      }
    }
  ]
}

/**
 *
 * @param {ComputedContext} context
 * @returns {import('../../@types/FormSchema').FormSchema[]}
 */
function briteSchema (context) {
  const requestingCrypto = context.formData.currency === CurrencyType.CRYPTO
  
  return [
    {
      maxCols: 2,
      cols: {
        availableAmount: {
          component: 'money-input',
          disabled: true
        }
        /*clubCardNumber: {
          disabled: !!context.$auth.user.clubCardNumber,
          validations: {
            required: {}
          }
        }*/
      }
    }, {
      colsBreakpoints: {
        cols: '12'
      },
      cols: {
        requestAmount: {
          component: 'money-input',
          maxValue: context.formData.availableAmount,
          validations: {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: context.formData.availableAmount
            },
            multipleOf: {
              params: {
                step: 50,
                until: context.$store.getters['settings/globalSettings'].cardsRequestMinAmount
              }
            }
          }
        },
        cryptoCurrency: {
          label: 'requestDialog.crypto-currency',
          component: 'v-select',
          items: CryptoCurrency.list,
          if: requestingCrypto,
          validations: {
            requiredIf: {
              params: () => requestingCrypto
            }
          }
        },
        cryptoAddress: {
          label: 'requestDialog.crypto-address',
          if: requestingCrypto,
          validations: {
            requiredIf: {
              params: () => requestingCrypto
            }
          }
        },
        notes: {
          component: 'v-textarea',
          label: 'request-notes',
          hint: 'request-notes-hint',
          persistentHint: true,
          validations: {
            // required: {}
          }
        }
      }
    }
  ]
}

export { goldSchema, briteSchema }
