import { BasicApiCall } from '~/classes/BasicApiCall'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { AxiosResponse } from 'axios'

export class CalendarEventsApi extends BasicApiCall {
  // @ts-ignore
  async all (filters: any): Promise<CalendarEvent[]>;
  async all (filters: any, paginationDto: PaginationDto): Promise<PaginatedResult<CalendarEvent>>;
  async all (filters: any, paginationDto?: PaginationDto): Promise<any> {
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
    
    return data as any
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
  
  async download (filters: any): Promise<AxiosResponse> {
    return await this._call({
      endPoint: '/api/calendarEvents/download',
      method: 'GET',
      downloadMode: true,
      params: { filters }
    })
  }
}
