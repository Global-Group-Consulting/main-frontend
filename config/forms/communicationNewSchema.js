/**
 * @typedef {import('../../@types/FormSchema').FormSchema} FormSchema
 */

import MessageTypes from "@/enums/MessageTypes"
import UserRoles from "@/enums/UserRoles";

/**
 *
 * @param {FormContext} context
 * @returns {FormSchema[]}
 */
export default function (context) {
  const userType = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(context.$auth.user.role) ? "admin" : "user"
  const messageType = context.dialogData.type !== MessageTypes.CONVERSATION ? "communication" : "ticket"

  return [
    {
      cols: {
        'subject': {
          label: "communication-subject",
          outlined: true,
          dense: true,
          validations: {
            required: {}
          }
        },
      }
    },
    {
      cols: {
        'receiver': {
          label: "communication-receiver",
          component: userType === "admin" ? "receivers-combobox" : "v-select",
          multiple: userType === "admin",
          outlined: true,
          offsetY: true,
          clearable: userType === "admin",
          deletableChips: userType === "admin",
          dense: true,
          showRole: messageType === "ticket",
          smallChips: userType === "admin",
          items: context.availableReceivers,
          validations: {
            required: {}
          }
        },
      },
    },
    {
      cols: {
        'watchers': {
          label: "communication-cc",
          component: "receivers-combobox",
          multiple: true,
          outlined: true,
          clearable: true,
          deletableChips: true,
          dense: true,
          smallChips: true,
          items: context.availableCC,
          if: context.dialogData.type === MessageTypes.CONVERSATION
            && userType === "admin"
        },
      }
    },
    {
      cols: {
        'message': {
          label: "communication-message",
          component: 'v-textarea',
          rows: 5,
          dense: true,
          outlined: true,
          autoSize: true,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        'attachments': {
          label: "communication-attachments",
          component: 'file-uploader',
          hideDetails: true,
          multiple: true,
          preview: true,
          outlined: true,
          dense: true,
          prependIcon: ""
        }
      }
    }
  ]
}
