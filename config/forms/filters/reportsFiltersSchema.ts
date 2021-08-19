import {FormSchema} from "~/@types/FormSchema";
import Vue from "vue";
import moment from "moment";
import {Moment} from "moment/moment";
import MovementTypes from "~/enums/MovementTypes";
import {User} from "~/@types/UserFormData";

export const reportsFiltersFieldsMap = {}

function calcDates(type: "withdrawals" | "commissions", month: Moment): string[] {
  const momentDate = month

  let startDate = moment(momentDate).subtract(1, "months").set({
    date: type === 'withdrawals' ? 16 : 1,
    hour: 0,
    minute: 0,
    second: 0,
  })
  let endDate = moment(momentDate).set({
    date: type === 'withdrawals' ? 15 : 1,
    hour: 23,
    minute: 59,
    second: 59,
  })

  if (type === 'commissions') {
    endDate = endDate.subtract(1, "days")
  }

  return [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
}

function getDatesList(type: "withdrawals" | "commissions"): string[][] {
  const toReturn: string[][] = []
  let currMonth = moment()

  for (let i = 0; i < 6; i++) {
    toReturn.push(calcDates(type, currMonth))

    currMonth.subtract(1, "month");
  }

  return toReturn
}

function formatUsers(list: User[]) {
  return list.map((user: User) => ({
    text: user.firstName + " " + user.lastName,
    value: user.id
  }))
}

export default function (this: Vue & { inputsData: any, filtersKey: "withdrawals" | "commissions" }): FormSchema[] {

  return [
    {
      cols: {
        dates: {
          label: "reports.dates",
          component: "date-picker-range",
          clearable: false,
          range: true,
          selectableDates: getDatesList(this.filtersKey)
        },
        amountRange: {
          component: "money-input-range",
          minLabel: "reports.amount-min",
          maxLabel: "reports.amount-max",
        },
        movementType: {
          label: "reports.type",
          component: "v-autocomplete",
          clearable: true,
          if: this.filtersKey === "withdrawals",
          items: [
            {
              value: MovementTypes.DEPOSIT_COLLECTED,
              text: "Prelievo deposito"
            }, {
              value: MovementTypes.INTEREST_COLLECTED,
              text: "Riscossione Interessi"
            }
          ]
        },
        user: {
          label: "reports.user",
          component: "v-autocomplete",
          clearable: true,
          items: formatUsers((this.filtersKey === "withdrawals"
              ? this.inputsData?.usersList
              : this.inputsData?.agentsList)
            || [])
        },
        referenceAgent: {
          label: "reports.reference-agent",
          component: "v-autocomplete",
          clearable: true,
          items: formatUsers(this.inputsData?.agentsList || [])
        }
      }
    }
  ]
}
