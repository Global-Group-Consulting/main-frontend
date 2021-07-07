import {FormSchema} from "~/@types/FormSchema";
import Vue from "vue";
import {User} from "~/@types/UserFormData";
import {sortBy} from "lodash";

interface FormContext extends Vue {
  incomingData: User
}

function agentsList(this: FormContext) {
  const list = this.$store.getters["agentsList"]
    .filter((user: User) => user.id !== this.incomingData.id);

  return sortBy(list, ["lastName", "firstName"])
    .reduce((acc, curr) => {

      acc.push({
        text: curr.firstName + " " + curr.lastName,
        value: curr.id
      })

      return acc;
    }, [{
      text: "-- Nessun agente --",
      value: ""
    }])
}

export function userRoleChangeDialog(context: FormContext): FormSchema[] {
  return [
    {
      maxCols: 1,
      cols: {
        newAgent: {
          label: "userRoleChange.new-agent",
          component: "v-autocomplete",
          items: agentsList.call(context)
        }
      }
    }, {
      maxCols: 1,
      cols: {
        commissionsReceiver: {
          label: "userRoleChange.commissions-receiver",
          component: "v-autocomplete",
          items: agentsList.call(context),
        }
      }
    }
  ]
}
