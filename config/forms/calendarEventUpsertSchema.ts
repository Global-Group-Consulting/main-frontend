import { FormSchema } from '~/@types/FormSchema'
import { dateFormatter } from '~/plugins/filters'
import { ApiCalls } from '~/plugins/apiCalls'
import { User } from '~/@types/UserFormData'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { Store } from 'vuex'
import { I18n } from '~/@types/I18nPlugin'
import moment from 'moment-timezone'

export default function (formData: any, categories: any[], $apiCalls: ApiCalls, $store: Store<any>, $i18n: I18n, originalEvent?: CalendarEvent): FormSchema[] {
  const userIsAgent = $store.getters['user/userIsAgente']
  const userIsAdmin = $store.getters['user/userIsAdmin']
  const showReturnDate = true //userIsAgent
  const isNewEvent = !originalEvent?._id
  const canEditReturnDate = showReturnDate && (originalEvent && !originalEvent.returnEventId || isNewEvent)
  const hasReturnEvent = !!originalEvent?.returnEventId
  const isReturnEvent = originalEvent?.isReturnEvent
  const required = $store.getters['user/userIsAdmin'] ? false : (userIsAgent && !isReturnEvent)
  
  return [
    {
      colsBreakpoints: { cols: '12', sm: '6' },
      cols: {
        clientId: {
          label: 'calendarEvent.client',
          component: 'async-autocomplete',
          componentProps: { allowNewItems: true, newItemConfirm: true },
          asyncFn: $apiCalls.selectOptions.getUsersList,
          items: formData.client
            // case where a valid client is selected
            ? [{
              rawData: formData.client,
              text: formData.client.firstName + ' ' + formData.client.lastName,
              value: formData.clientId
            }]
            // case where an unknown clientName is selected
            : (formData.clientName ? [{
                  rawData: formData.clientName,
                  text: formData.clientName,
                  value: formData.clientName
                }]
                // case where nothing is provided
                : []
            ),
          validations: {
            required: {}
          }
        },
        name: {
          label: 'calendarEvent.title',
          validations: {
            required: {}
          }
        },
        place: {
          label: 'calendarEvent.place',
          validations: {
            required: {}
          }
        },
        categoryId: {
          label: 'calendarEvent.category',
          component: 'v-select',
          items: categories,
          validations: {
            required: {}
          }
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
          clearable: false,
          validations: {
            required: {}
          }
        },
        startTime: {
          label: 'calendarEvent.startTime',
          component: 'time-picker',
          min: "07:00",
          max: "23:00",
          validations: {
            required: {}
          }
        },
        endDate: {
          label: 'calendarEvent.endDate',
          component: 'date-picker',
          clearable: false,
          startByYear: false,
          validations: {
            required: {}
          }
        },
        endTime: {
          label: 'calendarEvent.endTime',
          component: 'time-picker',
          min: "07:00",
          max: "23:00",
          validations: {
            required: {}
          }
        },
        returnDate: {
          label: 'calendarEvent.returnDate',
          component: 'date-picker',
          startByYear: false,
          if: showReturnDate,
          messages: hasReturnEvent ? $i18n.t('forms.calendarEvent.returnDateHint', {
            date: originalEvent && originalEvent.returnDate ? moment(originalEvent.returnDate).format('YYYY-MM-DD') : '',
            id: originalEvent?.returnEventId
          }) as string : '',
          disabled: !canEditReturnDate,
          validations: canEditReturnDate ? {
            ...(required ? { required: {} } : {}),
            // required: {},
            minDate: { params: { min: formData.endDate, canBeEqual: true } }
          } : {}
        },
        returnTime: {
          label: 'calendarEvent.returnTime',
          component: 'time-picker',
          if: showReturnDate,
          disabled: !canEditReturnDate,
          min: "07:00",
          max: "23:00",
          validations: canEditReturnDate ? {
            ...(required ? { required: {} } : {})
          } : {}
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
          validations: {
            required: {},
            minLength: { params: 100 }
          }
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
          // ad admin can create an event without agent so that it will be public
          validations: !userIsAdmin ? {
            required: {}
          } : {}
        }
      }
    },
  
  ]
}
