import {FormSchema} from "~/@types/FormSchema";
import RequestTypes from "~/enums/RequestTypes";
import RequestStatus from "~/enums/RequestStatus";
import {RequestFormData} from "~/@types/Requests";
import {RangeValue} from "~/@types/components/form/MoneyInputRange";
import {User} from "~/@types/UserFormData";
import {SelectOption} from "~/@types/components/SelectInput";
import moment from "moment";
import UserRoles from "~/enums/UserRoles";

function getDistinctUsers(requests: RequestFormData[]): SelectOption[] {
  const toReturn: Record<string, SelectOption> = {};

  requests.forEach((request) => {
    if (!request.user || !request.user.id) {
      return
    }

    const user = request.user

    if (!toReturn[user.id]) {
      toReturn[user.id] = {
        value: user.id,
        text: user.firstName + " " + user.lastName
      }
    }
  })

  return Object.values(toReturn)
}

function getDistinctRefAgents(requests: RequestFormData[]): SelectOption[] {
  const toReturn: Record<string, SelectOption> = {};

  requests.forEach((request) => {
    if (!request.user || !request.user.referenceAgent
      || !request.user.referenceAgentData || !request.user.referenceAgentData.id) {
      return
    }

    const agent = request.user.referenceAgentData

    if (!toReturn[agent.id]) {
      toReturn[agent.id] = {
        value: agent.id,
        text: agent.firstName + " " + agent.lastName
      }
    }
  })

  return Object.values(toReturn)
}

export const requestsFiltersFieldsMap = {
  type: ["type"],
  amount: (data: RequestFormData, searchValue: RangeValue): boolean => {
    let toReturn = true;

    const min = searchValue.min;
    const max = searchValue.max;
    const conditions = []

    if (min) {
      conditions.push(data.amount >= min);
    }

    if (max) {
      conditions.push(data.amount <= max);
    }

    conditions.forEach(cond => {
      if (!cond) {
        toReturn = false
      }
    })

    return toReturn;
  },
  user: ["userId"],
  status: ["status"],
  referenceAgent: ["user.referenceAgent"],
  createdAt: (data: RequestFormData, searchValue: string[] | null): boolean => {
    let toReturn = true;

    if (!searchValue) {
      return toReturn
    }

    const min = searchValue[0];
    const max = searchValue[1];
    const conditions = []

    if (min) {
      conditions.push(moment(data.created_at).isSameOrAfter(min, "day"));
    }

    if (max) {
      conditions.push(moment(data.created_at).isSameOrBefore(max, "day"));
    }

    conditions.forEach(cond => {
      if (!cond) {
        toReturn = false
      }
    })

    return toReturn;
  },
  completedAt: (data: RequestFormData, searchValue: string[] | null): boolean => {
    let toReturn = true;

    if (!searchValue) {
      return toReturn
    }

    const min = searchValue[0];
    const max = searchValue[1];
    const conditions = []

    if (min) {
      conditions.push(moment(data.completed_at).isSameOrAfter(min, "day"));
    }

    if (max) {
      conditions.push(moment(data.completed_at).isSameOrBefore(max, "day"));
    }

    conditions.forEach(cond => {
      if (!cond) {
        toReturn = false
      }
    })

    return toReturn;
  },
  clubCardNumber: ["clubCardNumber"],
  autoWithdrawlAll: ["autoWithdrawlAll"],
}

export default function (this: Vue): FormSchema[] {
  const dataToFilter = this.$store.getters["filters/dataToFilter"];
  const userAdmin = this.$store.getters["user/userIsAdmin"];

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
          component: "money-input-range",
          minLabel: "filters-money-min",
          maxLabel: "filters-money-max",
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
          items: getDistinctUsers(dataToFilter),
          clearable: true,
          if: userAdmin
        },
        referenceAgent: {
          label: "filters-reference-agent",
          component: "v-autocomplete",
          items: getDistinctRefAgents(dataToFilter),
          clearable: true,
          if: userAdmin
        },
        createdAt: {
          label: "filters-creation-date",
          component: "date-picker-range",
          range: true,
          startByYear: false
        },
        completedAt: {
          label: "filters-completed-date",
          component: "date-picker-range",
          range: true,
          startByYear: false
        },
        clubCardNumber: {
          if: userAdmin
        },
        autoWithdrawlAll: {
          label: "filters-auto-withdrawl-all",
          component: "v-switch",
          falseValue: false,
          if: this.$auth.user.role !== UserRoles.CLIENTE
        },
      }
    }
  ]

}
