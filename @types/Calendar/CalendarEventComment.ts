import { User } from '~/@types/UserFormData'

export interface CalendarEventCommentReading {
  userId: string,
  createdAt: string
  
  updatedAt?: string
}

export interface CalendarEventComment {
  readonly _id: string
  eventId: string;
  authorId: string;
  author: Pick<User, '_id' | 'firstName' | 'lastName'>;
  readings: CalendarEventCommentReading[];
  message: string;
  created_at: string;
  updated_at: string;
}
