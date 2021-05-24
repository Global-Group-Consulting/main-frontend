import {FormSchema} from "~/@types/FormSchema";


export function globalSettings(context: Vue): FormSchema[] {
  return [
    {
      cols: {
        maintenanceMode: {
          component: "v-switch",
        }
      }
    },
    {
      cols: {
        requestsBlockTime: {
          component: "time-picker-range",
          hint: "requests-block-time-hint",
          persistentHint: true
        },
        requestsBlockTimeCriticDays: {
          component: "time-picker-range",
          hint: "requests-block-time-critic-days-hint",
          persistentHint: true,
          max: "18:00",
          min: "5:00"
        }
      }
    }
  ]
}
