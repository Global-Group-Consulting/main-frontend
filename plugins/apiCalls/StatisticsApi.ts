import { BasicApiCall } from '~/classes/BasicApiCall'
import { SystemTotalsDto } from '~/@types/dto/statistics/SystemTotalsDto'
import { CommissionTotalsDto } from '~/@types/dto/statistics/CommissionTotalsDto'
import { UserTotalsDto } from '~/@types/dto/statistics/UserTotalsDto'
import { NewUsersCountDto } from '~/@types/dto/statistics/NewUsersCountDto'
import { AgentNewUsersCountDto } from '~/@types/dto/statistics/AgentNewUsersCountDto'
import { AgentNewDepositsCountDto } from '~/@types/dto/statistics/AgentNewDepositsCountDto'

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
  
  async getUserStatuses (filters?: any): Promise<UserTotalsDto> {
    return await this.get({
      endPoint: '/api/statistics/userStatuses',
      params: { filters }
    })
  }
  
  async getUsersCount (filters?: any): Promise<NewUsersCountDto> {
    return await this.get({
      endPoint: '/api/statistics/newUsersCount',
      params: { filters }
    })
  }
  
  async getAgentNewUsersCount (filters?: any): Promise<AgentNewUsersCountDto[]> {
    return await this.get({
      endPoint: '/api/statistics/agents/newUsersCount',
      params: { filters }
    })
  }
  
  async getAgentNewDepositsCount (filters?: any): Promise<AgentNewDepositsCountDto[]> {
    return await this.get({
      endPoint: '/api/statistics/agents/newDepositsCount',
      params: { filters }
    })
  }
  
}
