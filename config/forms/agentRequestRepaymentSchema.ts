import {User, UserDataSchema} from "~/@types/UserFormData";
import RequestTypes from "~/enums/RequestTypes";
import {RequestFormData} from "~/@types/Requests";
import WalletTypes from "~/enums/WalletTypes";

interface FormContext extends Vue {
  dialogData: any,
  formData: RequestFormData,
  user: User
}

export default function (context: FormContext) {
  return [
    {
      cols: {
        availableAmount: {
          disabled: true,
          component: 'money-input',
          currency: context.formData.currency
        }
      }
    },
    {
      cols: {
        amount: {
          label: "requestAmount",
          component: 'money-input',
          currency: context.formData.currency,
          maxValue: context.formData.availableAmount,
          validations: {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: context.formData.availableAmount || .5
            }
          }
        },
      }
    },
    {
      cols: {
        notes: {
          label: "requestNotes",
          component: 'v-textarea',
          autoGrow: true,
          rows: 1,
          validations: {
            required: {}
          }
        }
      }
    },
  ]
}
