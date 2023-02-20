import { BasicApiCall } from '~/classes/BasicApiCall'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { GetCountersDto } from '~/@types/dto/GetCounters.dto'
import { GetStatisticsDto } from '~/plugins/apiCalls/UserApi'
import { RequestFormData } from '~/@types/Requests'

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
  
  async createRequest (data: any) {
    return await this.post({
      endPoint: `/api/requests`,
      body: data,
      uploadMode: true
    })
  }
  
  async createAdminRequest (data: any) {
    return await this.post({
      endPoint: `/api/requests/admin`,
      body: data,
      uploadMode: true
    })
  }
  
  async createAgentRequest (data: any) {
    return await this.post({
      endPoint: `/api/requests/agent`,
      body: data
    })
  }
  
  async deleteRequest (requestId: string) {
    return await this._call({
      method: 'DELETE',
      endPoint: `/api/requests/${requestId}`
    })
  }
  
  async acceptRequest (data: RequestFormData, paymentDocDate: Date, paymentAmount: number, paymentGoldAmount: number) {
    return await this._call({
      method: 'PUT',
      endPoint: `/api/requests/${data.id || data._id}/approve`,
      body: {
        paymentDocDate,
        paymentAmount,
        paymentGoldAmount
      }
    })
  }
  
  async rejectRequest (data: any) {
    return await this._call({
      method: 'PUT',
      endPoint: `/api/requests/${data.id || data._id}/reject`,
      body: { reason: data.reason }
    })
  }
  
  async cancelRequest (data: any) {
    return await this._call({
      method: 'PUT',
      endPoint: `/api/requests/${data.id || data._id}/cancel`,
      body: { reason: data.reason }
    })
  }
  
  async downloadRequestReceipt (reqId: string, type: 'movement' | 'request') {
    return await this._call({
      method: 'GET',
      endPoint: `/api/docs/receipt/deposit`,
      downloadMode: true,
      params: {
        id: reqId,
        type: type
      }
    })
  }
  
  async uploadAttachment (reqId: string, file: File) {
    return await this._call({
      method: 'POST',
      endPoint: `/api/requests/${reqId}/attachments`,
      body: { "requestAttachment": file },
      uploadMode: true
    })
  }
  
}
