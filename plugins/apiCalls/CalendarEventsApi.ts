import { BasicApiCall } from '~/classes/BasicApiCall'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'

export class CalendarEventsApi extends BasicApiCall {
  async all (filters: any, paginationDto?: PaginationDto): Promise<CalendarEvent[] | PaginatedResult<CalendarEvent>> {
    const params: any = {}
    
    if (paginationDto) {
      Object.assign(params, paginationDto)
      params.paginate = true
    }
    
    params.filters = filters
    
    const result = await this.get({ endPoint: '/api/calendarEvents/', params })
    let data: CalendarEvent[] = result
    
    if (paginationDto) {
      data = result.data
    }
    
    data = data.map((event) => {
      // Update the event's start and end dates to be Date objects
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        timed: true
      }
    })
    
    if (paginationDto) {
      return {
        ...result,
        data
      }
    }
    
    return data
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
