import { BasicApiCall } from '~/classes/BasicApiCall'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'

export class CalendarCategoriesApi extends BasicApiCall {
  async all (): Promise<CalendarCategory[]> {
    return this.get({ endPoint: '/api/calendarCategories/' })
  }
  
  async create (data: any): Promise<CalendarCategory> {
    return await this.post({ endPoint: '/api/calendarCategories/', data })
  }
  
  async update (data: any, id: string): Promise<CalendarCategory> {
    return await this._call({
      endPoint: '/api/calendarCategories/' + id,
      method: 'PATCH',
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
