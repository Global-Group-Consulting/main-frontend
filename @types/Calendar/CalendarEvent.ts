import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'
import { User } from '~/@types/UserFormData'
import { CalendarEventComment } from '~/@types/Calendar/CalendarEventComment'

export interface CalendarEvent {
  readonly _id: string
  name: string;
  start: Date;
  end: Date;
  
  returnDate?: Date;
  returnEventId?: string;
  isReturnEvent?: boolean;
  
  /**
   * false for all day events, true for timed events
   */
  timed: boolean
  categoryId: string
  
  category?: CalendarCategory
  
  notes: string
  place: string
  
  /**
   * the user who created the event
   */
  authorId: string
  
  /**
   * the user who the event belongs to. This is the user who will see the event in their calendar. For admins, this could be empty, indicating global events.
   */
  userIds: string[]
  
  users: Pick<User, '_id' | 'firstName' | 'lastName'>[]
  
  /**
   * the client indirectly related to the event
   */
  clientId: string
  
  client: Pick<User, '_id' | 'firstName' | 'lastName'>
  clientName?: string
  isPublic: boolean
  
  unreadComments: Pick<CalendarEventComment, '_id' | 'authorId' | 'eventId'>[]
}
