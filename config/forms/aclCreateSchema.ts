import {FormSchema} from "~/@types/FormSchema";

import {UserDataSchema} from "~/@types/UserFormData";
import {Permissions} from "~/@types/Permissions";

interface FormContext extends Vue {
  dialogData: any,
  formData: UserDataSchema
}

export default function (context: FormContext): FormSchema[] {
  return [
    {
      cols: {
        code: {
          label: "acl-code",
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        description: {
          label: "acl-description",
          validations: {
            required: {}
          }
        }
      }
    },
    {
      if: !!context.dialogData.data.permissionsListSelect,
      cols: {
        permissions: {
          component: "v-autocomplete",
          label: "acl-permissions",
          multiple: true,
          items: context.dialogData.data.permissionsListSelect
        }
      }
    }
  ]
}
