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
          max: "20:00",
          min: "5:00"
        }
      }
    },
    {
      legend: "settings.emails_notifications_label",
      cols: {
        clubRequestNotifyEmail: {
          label: "filters-club-request-notify-email",
          validations: {
            email: {},
            required: {}
          }
        },
        requestBriteEmail: {
          label: "settings.request-brite-email",
          validations: {
            email: {},
            required: {}
          }
        }
      }
    },
    {
      legend: "settings.agents_requests_label",
      cols: {
        requestMinAmount: {
          label: "settings.request-min-amount",
          component: "money-input",
          showBrite: false,
          validations: {
            required: {}
          }
        },
        requestBritePercentage: {
          label: "settings.request-brite-percentage",
          type: "number",
          validations: {
            minValue: {params: 0.1},
            maxValue: {params: 100},
            required: {}
          }
        },

      }
    }
  ]
}
