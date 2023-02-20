import { BasicApiCall } from '~/classes/BasicApiCall'
import { PaginationDto } from '~/@types/pagination/PaginationDto'

export class MovementApi extends BasicApiCall {
  async fetchMovementsList (_id: string) {
    return (await this.get({
      endPoint: `/api/movements` + (_id ? `/${_id}` : '')
    }))
  }
  
  async filter (_id: string, paginationDto: PaginationDto) {
    // filter only if I have something to filter
    // if (!paginationDto.filters || Object.keys(paginationDto.filters).length === 0) {
      // return
    // }
    
    return await this._call({
      endPoint: `/api/movements/` + (_id ? `${_id}` : ''),
      params: paginationDto ?? {}
    })
  }
  
  async importMovementsList (body: any) {
    return (await this._call({
      method: 'POST',
      endPoint: `/api/movements/import`,
      body,
      uploadMode: true
    }))
  }
  
  /**
   * @returns {{
   *  deposit: number
   *  interestAmount: number
   *  interestPercentage: number
   * }}
   */
  async fetchWalletStatus (data?: any) {
    return await this.get({
      endPoint: '/api/movements/status' + (data && data.userId ? `/${data.userId}` : '')
    })
  }
}
