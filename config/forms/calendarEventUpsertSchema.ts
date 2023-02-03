import { FormSchema } from '~/@types/FormSchema'
import { dateFormatter } from '~/plugins/filters'
import { ApiCalls } from '~/plugins/apiCalls'
import { User } from '~/@types/UserFormData'

export default function (formData: any, categories: any[], $apiCalls: ApiCalls): FormSchema[] {
  return [
    {
      colsBreakpoints: { cols: '12', sm: '6' },
      cols: {
        name: {
          label: 'calendarEvent.title',
          validations: {
            required: {}
          }
        },
        place: {
          label: 'calendarEvent.place',
          validations: {}
        },
        categoryId: {
          label: 'calendarEvent.category',
          component: 'v-select',
          items: categories,
          validations: {
            required: {}
          }
        },
        
        clientId: {
          label: 'calendarEvent.client',
          component: 'async-autocomplete',
          asyncFn: $apiCalls.selectOptions.getUsersList,
          items: formData.client ? [{
            rawData: formData.client,
            text: formData.client.firstName + ' ' + formData.client.lastName,
            value: formData.clientId
          }] : [],
          validations: {}
        }
      }
    },
    {
      colsBreakpoints: { cols: '12' },
      cols: {
        userIds: {
          label: 'calendarEvent.agent',
          component: 'async-autocomplete',
          multiple: true,
          asyncFn: $apiCalls.selectOptions.getAgentsList,
          items: formData.users ? formData.users.map((user: Partial<User>) => ({
            rawData: user,
            text: user.firstName + ' ' + user.lastName,
            value: user._id
          })) : [],
          validations: {}
        }
      }
    },
    {
      colsBreakpoints: { cols: '12' },
      cols: {
        notes: {
          component: 'v-textarea',
          label: 'calendarEvent.notes',
          rows: 2,
          autoGrow: true,
          validations: {}
        }
      }
    },
    {
      colsBreakpoints: { cols: '6' },
      cols: {
        startDate: {
          label: 'calendarEvent.startDate',
          component: 'date-picker',
          startByYear: false,
          validations: {
            required: {}
          }
        },
        startTime: {
          label: 'calendarEvent.startTime',
          component: 'time-picker',
          validations: {
            required: {}
          }
        },
        endDate: {
          label: 'calendarEvent.endDate',
          component: 'date-picker',
          startByYear: false,
          validations: {
            required: {}
            // minValue: { params: formData.startDate }
          }
        },
        endTime: {
          label: 'calendarEvent.endTime',
          component: 'time-picker',
          validations: {
            required: {}
          }
        }
      }
    }
  
  ]
}
