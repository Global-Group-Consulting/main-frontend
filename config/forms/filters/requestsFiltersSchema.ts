import {FormSchema} from "~/@types/FormSchema";
import RequestTypes from "~/enums/RequestTypes";
import RequestStatus from "~/enums/RequestStatus";
import {RequestFormData} from "~/@types/Requests";
import {RangeValue} from "~/@types/components/form/MoneyInputRange";
import {User} from "~/@types/UserFormData";
import {SelectOption} from "~/@types/components/SelectInput";
import moment from "moment";
import UserRoles from "~/enums/UserRoles";

function getDistinctUsers (requests: RequestFormData[]): SelectOption[] {
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

function getRequestTypeList(this: Vue) {
  const userRole = this.$store.getters["user/userRole"];

  const list = RequestTypes.iterable.reduce((acc: any[], curr) => {
    let mustReturn = true

    if (curr.hasOwnProperty("reqRoles") && curr.reqRoles instanceof Array) {
      mustReturn = curr.reqRoles.includes(userRole)
    }

    if (mustReturn) {
      acc.push({
        value: curr.value,
        text: this.$t("enums.RequestTypes." + curr.id),
        order: curr.order || 99
      })
    }

    return acc
  }, [])

  list.sort((a, b) => a.order - b.order)

  return list
}

export const requestsFiltersFieldsMap = {
  type: (data: RequestFormData, searchValue: string): boolean => {
    if (+searchValue === RequestTypes.VERSAMENTO_INIZIALE) {
      return data.initialMovement
    } else if (+searchValue === RequestTypes.VERSAMENTO) {
      return data.type === +searchValue && !data.initialMovement
    } else {
      return data.type === +searchValue
    }
  },
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

const booleanSelectOptions = [
  {
    value: true,
    text: 'Si'
  },
  {
    value: false,
    text: 'No'
  }
]

export default function (this: Vue): FormSchema[] {
  const dataToFilter = this.$store.getters["filters/dataToFilter"];
  const userAdmin = this.$store.getters["user/userIsAdmin"];
  const userIsCliente = this.$store.getters["user/userIsCliente"];

  return [
    {
      cols: {
        type: {
          label: "request-type",
          component: "v-select",
          clearable: true,
          items: getRequestTypeList.call(this)
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
          component: "v-select",
          label: "filters-auto-withdrawl-all",
          clearable: true,
          if: this.$auth.user.role !== UserRoles.CLIENTE,
          items: booleanSelectOptions
        },
      }
    }
  ]

}
