import {FormSchema} from "~/@types/FormSchema";

import {UserDataSchema} from "~/@types/UserFormData";
import {Permissions} from "~/@types/Permissions";
import CurrencyType from "~/enums/CurrencyType";

interface FormContext extends Vue {
  dialogData: any,
  formData: UserDataSchema
}

export default function (): FormSchema[] {
  return [
    {
      cols: {
        amountChange: {
          component: "money-input",
          label: "amount-change",
          validations: {
            required: {},
            minValue: {
              params: 1
            }
          }
        }
      }
    }, {
      cols: {
        notes: {
          label: "commissions-add-notes",
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
