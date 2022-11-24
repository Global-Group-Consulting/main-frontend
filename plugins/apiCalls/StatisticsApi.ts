import { BasicApiCall } from '~/classes/BasicApiCall'
import { SystemTotalsInDto, SystemTotalsOutDto } from '~/@types/dto/statistics/SystemTotalsDto'
import { CommissionTotalsDto } from '~/@types/dto/statistics/CommissionTotalsDto'
import { UserTotalsDto } from '~/@types/dto/statistics/UserTotalsDto'
import { NewUsersCountDto } from '~/@types/dto/statistics/NewUsersCountDto'
import { AgentNewUsersCountDto } from '~/@types/dto/statistics/AgentNewUsersCountDto'
import { AgentNewDepositsCountDto } from '~/@types/dto/statistics/AgentNewDepositsCountDto'
import { RefundReportDto } from '~/@types/dto/statistics/RefundReportDto'
import { WithdrawalDepositReportDto } from '~/@types/dto/statistics/WithdrawalDepositReportDto'
import { WithdrawalInterestReportDto } from '~/@types/dto/statistics/WithdrawalInterestReportDto'

export class StatisticsApi extends BasicApiCall {
  async getSystemTotalsIn (filters?: any): Promise<SystemTotalsInDto> {
    return await this.get({
      endPoint: '/api/statistics/systemTotalsIn',
      params: { filters }
    })
  }
  
  async getSystemTotalsOut (filters?: any): Promise<SystemTotalsOutDto> {
    return await this.get({
      endPoint: '/api/statistics/systemTotalsOut',
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
  
  async getRefundReport (filters?: any): Promise<RefundReportDto[]> {
    return await this.get({
      endPoint: '/api/statistics/refundReport',
      params: { filters }
    })
  }
  
  async getWithdrawalDepositReport (filters?: any): Promise<WithdrawalDepositReportDto[]> {
    return await this.get({
      endPoint: '/api/statistics/withdrawalDepositReport',
      params: { filters }
    })
  }
  
  async getWithdrawalInterestReport (filters?: any): Promise<WithdrawalInterestReportDto[]> {
    return await this.get({
      endPoint: '/api/statistics/withdrawalInterestReport',
      params: { filters }
    })
  }
  
}
