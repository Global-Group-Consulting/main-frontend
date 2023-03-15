import { BasicApiCall } from '~/classes/BasicApiCall'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { AxiosResponse } from 'axios'
import { CalendarEventComment, CalendarEventCommentReading } from '~/@types/Calendar/CalendarEventComment'

export class CalendarEventCommentsApi extends BasicApiCall {
  async readForEvent (eventId: string): Promise<CalendarEventComment[]> {
    const result = await this.get({ endPoint: '/api/calendarEventComments/' + eventId })
    
    return result
  }
  
  async create (eventId: string, comment: string): Promise<CalendarEventComment> {
    const result = await this.post({
      endPoint: '/api/calendarEventComments/' + eventId,
      data: {
        message: comment
      }
    })
    
    return result
  }
  
  async update (eventId: string, commentId: string, comment: string): Promise<CalendarEventComment> {
    const result = await this.post({
      endPoint: `/api/calendarEventComments/${eventId}/${commentId}`,
      data: {
        message: comment
      }
    })
    
    return result
  }
  
  async destroy (commentId: string): Promise<void> {
    return await this.delete({
      endPoint: `/api/calendarEventComments/${commentId}`
    })
  }
  
  async markAsRead (commentId: string): Promise<CalendarEventCommentReading[]> {
    return await this.patch({
      endPoint: `/api/calendarEventComments/${commentId}/markAsRead`
    })
  }
}
