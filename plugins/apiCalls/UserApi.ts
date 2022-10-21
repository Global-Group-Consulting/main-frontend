import { BasicApiCall } from '~/classes/BasicApiCall'
import { AclUserRoles } from '~/enums/AclUserRoles'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { GetCountersDto } from '~/@types/dto/GetCounters.dto'

export interface GetStatisticsDto {
  _id: string;
  count: number;
}

export class UserApi extends BasicApiCall {
  async filter (paginationDto: PaginationDto): Promise<PaginatedResult | undefined> {
    // filter only if I have something to filter
    if (!paginationDto.filters || Object.keys(paginationDto.filters).length === 0) {
      return
    }
    
    return await this._call({
      endPoint: `/api/users`,
      params: paginationDto ?? {}
    })
  }
  
  async fetchCounters (filters: any): Promise<GetCountersDto[]> {
    return await this._call({ endPoint: `/api/users/count`, params: { filters } })
  }
  
  async getStatistics (statisticType: string): Promise<GetStatisticsDto[]> {
    return await this._call({ endPoint: `/api/users/statistics`, params: { type: statisticType } })
  }
}
