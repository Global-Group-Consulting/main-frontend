import {FormSchema} from "~/@types/FormSchema";
import RequestTypes from "~/enums/RequestTypes";
import RequestStatus from "~/enums/RequestStatus";


export const requestsFiltersFieldsMap = {
  type: ["type"],
  amount: ["amount"],
  user: ["user"],
  status: ["status"],
  referenceAgent: ["user"],
  createdAt: ["created_at"],
  completedAt: ["completed_at"],
  clubCardNumber: ["clubCardNumber"],
  autoWithdrawlAll: ["autoWithdrawlAll"],
}

export default function (): FormSchema[] {
  return [
    {
      cols: {
        type: {
          label: "request-type",
          component: "v-select",
          clearable: true,
          items: RequestTypes
        },
        amount: {
          label: "request-amount",
          // componente range di prezzo.
          component: "money-input",
          clearable: true,
        },
        status: {
          label: "filters-request-status",
          component: "v-select",
          clearable: true,
          items: RequestStatus
        },
        user: {
          label: "filters-user",
          component: "v-autocomplete",
          clearable: true,
        },
        referenceAgent: {
          label: "filters-reference-agent",
          component: "v-autocomplete",
          clearable: true,
        },
        createdAt: {
          label: "filters-creation-date",
          component: "date-picker"
        },
        completedAt: {
          label: "filters-completed-date",
          component: "date-picker"
        },
        clubCardNumber: {},
        autoWithdrawlAll: {
          label: "filters-auto-withdrawl-all",
          component: "v-switch",
          falseValue: false
        },
      }
    }
  ]

}
