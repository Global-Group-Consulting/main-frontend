import { BasicApiCall } from '~/classes/BasicApiCall'
import { SystemTotalsDto } from '~/@types/dto/statistics/SystemTotalsDto'
import { CommissionTotalsDto } from '~/@types/dto/statistics/CommissionTotalsDto'

export class StatisticsApi extends BasicApiCall {
  async getSystemTotals (filters?: any): Promise<SystemTotalsDto> {
    return await this.get({
      endPoint: '/api/statistics/systemTotals',
      params: { filters }
    })
  }
  
  async getCommissionTotals (filters?: any): Promise<CommissionTotalsDto> {
    return await this.get({
      endPoint: '/api/statistics/commissionTotals',
      params: { filters }
    })
  }
  
}
