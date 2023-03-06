import { FormSchema } from '~/@types/FormSchema'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'
import { ApiCalls } from '~/plugins/apiCalls'

export default function (categories: CalendarCategory[], $apiCalls: ApiCalls): FormSchema[] {
  return [
    {
      cols: {
        name: {
          label: 'calendarEvent.title',
          clearable: true,
        },
        start: {
          label: 'calendarEvent.start-date',
          component: 'date-picker',
          startByYear: false,
          clearable: true,
        },
        end: {
          label: 'calendarEvent.end-date',
          component: 'date-picker',
          startByYear: false,
          clearable: true,
        },
        categoryId: {
          label: 'calendarEvent.category',
          component: 'v-select',
          clearable: true,
          items: categories.map((category) => ({
            value: category._id,
            text: category.name
          }))
        },
        userId: {
          label: 'calendarEvent.agent',
          component: 'async-autocomplete',
          asyncFn: $apiCalls.selectOptions.getAgentsList,
          clearable: true,
        },
        clientId: {
          label: 'calendarEvent.client',
          component: 'async-autocomplete',
          asyncFn: $apiCalls.selectOptions.getUsersList,
          clearable: true
        },
        place: {
          label: 'calendarEvent.place',
          clearable: true
        },
        createdAt: {
          label: 'calendarEvent.creation-date',
          component: 'date-picker-range',
          range: true,
          startByYear: false,
          clearable: true
        }
      }
    }
  ]
}
