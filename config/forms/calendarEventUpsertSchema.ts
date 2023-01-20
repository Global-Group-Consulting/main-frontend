import { FormSchema } from '~/@types/FormSchema'
import { dateFormatter } from '~/plugins/filters'

export default function (formData: any): FormSchema[] {
  return [
    {
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
          validations: {
            required: {}
          }
        },
        clientId: {
          label: 'calendarEvent.client',
          validations: {}
        }
      }
    },
    {
      colsBreakpoints: { 'cols': '12' },
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
            required: {},
            minValue: { params: new Date(formData.value.startDate) }
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
