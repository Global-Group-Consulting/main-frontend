import { BasicApiCall } from '~/classes/BasicApiCall'
import { DashboardBritesData } from '~/@types/Brites'

export interface ClubDashboardSemester {
  expiresAt: string
  usableFrom: string
  total: number
  totalAvailable: number
  totalUsed: number
  types: {
    deposit_added: number,
    interest_recapitalized: number
  }
}

export class ClubApi extends BasicApiCall {
  async dashboardStatistics (): Promise<Record<string, ClubDashboardSemester>> {
    return await this.get({
      endPoint: `/api/club/dashboard/semesters`
    })
  }
  
  async fetchStatistics (userId: string): Promise<DashboardBritesData> {
    return this.get({
      endPoint: 'api/ext/club/dashboard/statistics',
      params: {
        userId
      }
    })
  }
}
