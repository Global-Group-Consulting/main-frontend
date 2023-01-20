import { BasicApiCall } from '~/classes/BasicApiCall'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'

export class CalendarEventsApi extends BasicApiCall {
  async all () {
    const data: CalendarEvent[] = await this.get({ endPoint: '/api/calendarEvents/' })
    
    return data.map((event) => {
      // Update the event's start and end dates to be Date objects
      return {
        ...event,
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null
      }
    })
  }
  
  async create (data: any): Promise<CalendarEvent> {
    return await this.post({ endPoint: '/api/calendarEvents/', data })
  }
  
  async update (data: any, id: string): Promise<CalendarEvent> {
    return await this._call({
      endPoint: '/api/calendarEvents/' + id,
      method: 'PATCH',
      body: data
    })
  }
  
  async delete (id: string): Promise<void> {
    return await this._call({
      endPoint: '/api/calendarEvents/' + id,
      method: 'DELETE'
    })
  }
}
