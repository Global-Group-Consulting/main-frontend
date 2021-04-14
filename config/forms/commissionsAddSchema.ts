import {FormSchema} from "~/@types/FormSchema";

import {UserDataSchema} from "~/@types/UserFormData";
import {Permissions} from "~/@types/Permissions";
import CurrencyType from "~/enums/CurrencyType";
import CommissionType from "~/enums/CommissionType";
import {computed} from "@vue/composition-api";

interface FormContext extends Vue {
  dialogData: any,
  formData: FormData
}

interface FormData {
  referenceAgent: any
  amountChange: number | null,
  amountAvailable: number | null,
  notes: string,
  commissionType: string,
}

export default function (formData: FormData): FormSchema[] {
  const isManualTransfer = formData.commissionType === CommissionType.MANUAL_TRANSFER

  return [
    {
      cols: {
        referenceAgentData: {
          if: isManualTransfer,
          disabled: true
        }
      }
    },
    {
      cols: {
        amountAvailable: {
          component: "money-input",
          label: "available-amount",
          if: isManualTransfer,
          disabled: true
        }
      }
    },
    {
      cols: {
        amountChange: {
          component: "money-input",
          label: "amount-change",
          validations: {
            required: {},
            maxValue: {
              params: isManualTransfer ? (formData.amountAvailable || 0.01) : null
            },
            minValue: {
              params: 1
            },
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
