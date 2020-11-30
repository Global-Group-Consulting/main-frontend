/**
 * @typedef {import('../../@types/FormSchema').FormSchema} FormSchema
 */

import MessageTypes from "@/enums/MessageTypes"

/**
 *
 * @param {FormContext} formContext
 * @returns {FormSchema[]}
 */
export default function (context) {

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
          component: "receivers-combobox",
          multiple: true,
          outlined: true,
          clearable: true,
          deletableChips: true,
          dense: true,
          smallChips: true,
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
