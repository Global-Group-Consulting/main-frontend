import { BasicApiCall } from '~/classes/BasicApiCall'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'

export class CalendarCategoriesApi extends BasicApiCall {
  async all (): Promise<CalendarCategory[]> {
    return this.get({ endPoint: '/api/calendarCategories/' })
  }
  
  async upsert (data: any, id?: string): Promise<CalendarCategory> {
    return await this._call({
      endPoint: '/api/calendarCategories/' + (id ?? ''),
      method: 'POST',
      body: data
    })
  }
  
  async delete (id: string): Promise<void> {
    return await this._call({
      endPoint: '/api/calendarCategories/' + id,
      method: 'DELETE'
    })
  }
}
