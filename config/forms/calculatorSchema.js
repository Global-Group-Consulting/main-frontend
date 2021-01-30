/**
 * @typedef ComputedContext
 * @property { typeof import("../../plugins/enums").enums } $enums
 * @property {} $i18n
 * @property { {} } formData
 * @property { {data : {type: number}, readonly: boolean} } dialogData
 */

import moment from "moment"


export default function (context) {
  return [
    {
      cols: {
        initialDeposit: {
          label: "calcInitialDeposit",
          component: "money-input",
          showBrite: false
        },
        interestPercentage: {
          label: "calcInterestPercentage",
          type: "number",
          formatter: "percentageFormatter",
          appendIcon: "mdi-percent",
        }
      }
    },
    {
      cols: {
        initialDate: {
          label: "calcInitialDate",
          component: "date-picker",
          clearable: false
        },
        finalDate: {
          label: "calcFinalDate",
          component: "date-picker",
          clearable: false,
          min: moment(context.formData.initialDate).add(1, "years").toISOString(),
          max: moment(context.formData.initialDate).add(4, "years").toISOString()
        }
      }
    },
    {
      cols: {}
    },
  ]
}
