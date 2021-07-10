import {FormSchema} from "~/@types/FormSchema";
import {User} from "~/@types/UserFormData";
import CurrencyType from "~/enums/CurrencyType";

interface FormContext extends Vue {
  user: User,
  maxValue: number
}

export default function (formContext: FormContext): FormSchema[] {
  return [
    {
      cols: {
        availableAmount: {
          label: "agentBriteAdd.availableAmount",
          component: "money-input",
          onlyBrite: true,
          showBrite: false,
          currency: CurrencyType.BRITE,
          readonly: true
        }
      }
    },
    {
      cols: {
        amount: {
          label: "agentBriteAdd.amount",
          component: "money-input",
          onlyBrite: true,
          showBrite: false,
          currency: CurrencyType.BRITE,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        motivation: {
          label: "agentBriteAdd.motivation",
          component: "v-textarea",
          validations: {
            required: {}
          }
        }
      }
    },
  ]
}
