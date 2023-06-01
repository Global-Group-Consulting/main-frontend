import { BasicApiCall } from '~/classes/BasicApiCall'
import { ISession } from '~/composables/analytics'
import { PaginationDto } from '~/@types/pagination/PaginationDto'

export class AnalyticsApi extends BasicApiCall {
  
  async sendAndStore (userSession: ISession): Promise<any> {
    return this.post({
      endPoint: 'api/analytics/',
      body: userSession,
      setLoading: false
    })
  }
  
  async read(data: PaginationDto){
    return this.get({
      endPoint: 'api/analytics/',
      params: data,
    })
  }
}
