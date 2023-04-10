import { BasicApiCall } from '~/classes/BasicApiCall'
import { User } from '~/@types/UserFormData'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { Notification } from '~/@types/Notifications'

export class NotificationsApi extends BasicApiCall {
  async fetchUnread (): Promise<PaginatedResult<Notification>> {
    return await this.get({
      endPoint: 'api/ext/notifications/notifications',
      params: {
        platform: 'app'
      },
      setLoading: false
    })
  }
  
  async fetchUnreadCounters (): Promise<{ unread: number, read: number }> {
    return await this.get({
      endPoint: 'api/ext/notifications/notifications/counters',
      params: {
        platform: 'app'
      },
      setLoading: false
    })
  }
  
  async setAsRead (notificationId: string): Promise<{ unread: number, read: number }> {
    return await this.patch({
      endPoint: `api/ext/notifications/notifications/${notificationId}/read`,
      params: {
        platform: 'app'
      }
    })
  }
  
  async setAsUnread (notificationId: string): Promise<{ unread: number, read: number }> {
    return await this.patch({
      endPoint: `api/ext/notifications/notifications/${notificationId}/unread`,
      params: {
        platform: 'app'
      }
    })
  }
  
  async setAllAsRead (): Promise<{ unread: number, read: number }> {
    return await this.patch({
      endPoint: `api/ext/notifications/notifications/all/read`,
      params: {
        platform: 'app'
      }
    })
  }
  
}
