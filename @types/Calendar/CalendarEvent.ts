export interface CalendarEvent {
  readonly _id: string
  name: string;
  start: Date;
  end: Date;
  
  /**
   * false for all day events, true for timed events
   */
  timed: boolean
  category: string
  
  notes: string
  place: string
  
  /**
   * the user who created the event
   */
  authorId: string
  
  /**
   * the user who the event belongs to. This is the user who will see the event in their calendar. For admins, this could be empty, indicating global events.
   */
  userId: string
  
  /**
   * the client indirectly related to the event
   */
  clientId: string
}
