import { BasicApiCall } from '~/classes/BasicApiCall'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { GetCountersDto } from '~/@types/dto/GetCounters.dto'
import { GetStatisticsDto } from '~/plugins/apiCalls/UserApi'

export class RequestsApi extends BasicApiCall {
  async revert (data: { id: string, reason: string }) {
    return await this._call({
      method: 'PUT',
      endPoint: `/api/requests/${data.id}/revert`,
      body: { reason: data.reason }
    })
  }
  
  async filter (paginationDto: PaginationDto): Promise<PaginatedResult | undefined> {
    // filter only if I have something to filter
    if (!paginationDto.filters || Object.keys(paginationDto.filters).length === 0) {
      return
    }
    
    return await this._call({
      endPoint: `/api/requests`,
      params: paginationDto ?? {}
    })
  }
  
  async fetchCounters (filters: any): Promise<GetCountersDto[]> {
    return await this._call({ endPoint: `/api/requests/count`, params: { filters } })
  }
  
  async getStatistics (statisticType: string): Promise<GetStatisticsDto[]> {
    return await this._call({ endPoint: `/api/requests/statistics`, params: { type: statisticType } })
  }
}
