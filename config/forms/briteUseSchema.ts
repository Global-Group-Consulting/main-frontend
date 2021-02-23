import {FormSchema} from "~/@types/FormSchema";

import {UserDataSchema} from "~/@types/UserFormData";
import {Permissions} from "~/@types/Permissions";
import CurrencyType from "~/enums/CurrencyType";

interface FormContext extends Vue {
  dialogData: any,
  formData: UserDataSchema
}

export default function (formData: any): FormSchema[] {
  return [
    {
      cols: {
        availableAmount: {
          component: "money-input",
          currency: CurrencyType.BRITE,
          onlyBrite: true,
          disabled: true
        }
      }
    },

    {
      cols: {
        amount: {
          component: "money-input",
          label: "brite-use-amount",
          currency: CurrencyType.BRITE,
          onlyBrite: true,
          validations: {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: formData.availableAmount
            }
          }
        }
      }
    }, {
      cols: {
        notes: {
          label: "brite-use-notes",
          component: "v-textarea",
          autoGrow: true,
          rows: 1,
          validations: {
            required: {}
          }
        }
      }
    }
  ]
}
