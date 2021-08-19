import {BasicApiCall} from "~/classes/BasicApiCall";

export class ReportsApi extends BasicApiCall {
  async fetchWithdrawals(filters: any = {}) {
    return await this._call({
      method: "POST",
      endPoint: `/api/reports/withdrawals`,
      body: {
        filters
      }
    })
  }

  async fetchCommissions(filters: any = {}) {
    return await this._call({
      method: "POST",
      endPoint: `/api/reports/commissions`,
      body: {
        filters
      }
    })
  }
}
