/**
 * @typedef ComputedContext
 * @property { typeof import("../../plugins/enums").enums } $enums
 * @property {} $i18n
 * @property { {} } formData
 * @property { {data : {type: number}, readonly: boolean} } dialogData
 */

import RequestTypes from "../../enums/RequestTypes"
import RequestStatus from "../../enums/RequestStatus"

/**
 *
 * @param {ComputedContext} context
 * @returns {import("../../@types/FormSchema").FormSchema[]}
 */
function goldSchema(context) {
  return [
    {
      maxCols: 2,
      cols: {
        availableAmount: {
          component: "money-input",
          disabled: true,
          showBrite: false
        },
        requestAmount: {
          component: "money-input",
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
 * @returns {import("../../@types/FormSchema").FormSchema[]}
 */
function briteSchema(context) {
  return [
    {
      maxCols: 2,
      cols: {
        availableAmount: {
          component: "money-input",
          disabled: true
        },
        clubCardNumber: {
          type: "number",
          disabled: !!context.formData.clubCardNumber,
          validations: {
            required: {},
          }
        },
      },
    }, {
      maxCols: 2,
      cols: {
        requestAmount: {
          component: "money-input",
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
        },
        requestIban: {
          validations: {
            required: {}
          }
        }
      }
    }
  ]
}

export {goldSchema, briteSchema}
