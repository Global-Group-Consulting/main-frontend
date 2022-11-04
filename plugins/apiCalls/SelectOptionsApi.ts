import { BasicApiCall } from '~/classes/BasicApiCall'

export class SelectOptionsApi extends BasicApiCall {
  async getUsersList (searchText: string) {
    return await this.get({
      endPoint: '/api/selectOptions/users',
      params: {
        name: searchText
      }
    })
  }
  
  async getAgentsList (searchText: string) {
    return await this.get({
      endPoint: '/api/selectOptions/agents',
      params: {
        name: searchText
      }
    })
  }
  
}
