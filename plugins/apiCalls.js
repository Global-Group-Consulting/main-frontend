import {BasicApiCall} from '../classes/BasicApiCall'

import UserRoles from "../enums/UserRoles"

export class ApiCalls extends BasicApiCall {
  constructor(context) {
    super(context)
  }

  async userCreate(data) {
    return await this._call({
      method: "POST",
      endPoint: `/api/users`,
      body: data,
      uploadMode: true
    })
  }

  async userUpdate(data) {
    return await this._call({
      method: "PATCH",
      endPoint: `/api/users/${data.id}`,
      body: data,
      uploadMode: true
    })
  }

  async userDelete(userId) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/users/${userId}`
    })
  }

  async userApprove(userId) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/users/${userId}/approve`
    })
  }

  async userSendEmailActivation(userId) {
    return await this.post({
      endPoint: `/api/users/${userId}/sendEmailActivation`
    })
  }

  /**
   * @param {{id: string, status: string}} data
   */
  async userChangeStatus(data) {
    return await this.post({
      endPoint: `/api/users/${data.id}/status`,
      body: {
        status: data.status
      }
    })
  }

  async userConfirmDraft(userId) {
    return await this.post({
      endPoint: `/api/users/${userId}/confirmDraft`
    })
  }

  async userValidate(userId) {
    return await this.post({
      endPoint: `/api/users/${userId}/validate`
    })
  }

  /**
   *
   * @param {{userId: string, message: string, checkedFields: string[]}} data
   * @returns {Promise<void>}
   */
  async userIncomplete(data) {
    return await this.post({
      endPoint: `/api/users/${data.userId}/incomplete`,
      body: data
    })
  }

  async fetchAllUsers() {
    return await this.get({
      endPoint: `/api/users`
    })
  }

  async fetchAgents() {
    return await this.get({
      endPoint: `/api/users?f=` + UserRoles.AGENTE
    })
  }

  async fetchUserDetails(_id) {
    return (await this.get({
        endPoint: `/api/users/` + _id
      })
    )
  }

  async fetchMovementsList(_id) {
    return (await this.get({
      endPoint: `/api/movements` + (_id ? `/${_id}` : '')
    }))
  }

  async importMovementsList(body) {
    return (await this._call({
      method: "POST",
      endPoint: `/api/movements/import`,
      body,
      uploadMode: true
    }))
  }

  async importContract(body) {
    return (await this._call({
      method: "POST",
      endPoint: `/api/users/${body.userId}/importContract`,
      body,
      uploadMode: true
    }))
  }

  async dashboardData() {
    return await this.get({
      endPoint: "/api/dashboards"
    })
  }

  async authForgot(data) {
    return await this.post({
      endPoint: "/api/auth/forgot",
      body: data,
      setLoading: true
    })
  }

  async authRecover(data) {
    return await this.post({
      endPoint: "/api/auth/resetPassword",
      body: data,
      setLoading: true
    })
  }

  async authActivate(data) {
    return await this.post({
      endPoint: "/api/auth/activate",
      body: data,
      setLoading: true
    })
  }

  async downloadFile(fileId) {
    return await this.get({
      endPoint: `/api/files/${fileId}`,
      downloadMode: true
    })
  }

  async deleteFile(fileId) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/files/${fileId}`
    })
  }


  async fetchRequests() {
    return await this.get({
      endPoint: `/api/requests`
    })
  }

  async createRequest(data) {
    return await this.post({
      endPoint: `/api/requests`,
      body: data,
      uploadMode: true
    })
  }

  async deleteRequest(data) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/requests/${data.id}`,
    })
  }

  async acceptRequest(data, paymentDocDate) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/approve`,
      body: {
        paymentDocDate
      }
    })
  }

  async rejectRequest(data) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/reject`,
      body: {reason: data.reason}
    })
  }

  async cancelRequest(data) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/cancel`,
      body: {reason: data.reason}
    })
  }

  async downloadRequestReceipt(reqId) {
    return await this._call({
      method: "GET",
      endPoint: `/api/docs/receipt/deposit?id=${reqId}`,
      downloadMode: true
    })
  }

  async downloadRequestsReport(months) {
    return await this._call({
      method: "GET",
      endPoint: `/api/docs/reports/requests?m=${months}`,
      downloadMode: true
    })
  }

  /**
   * @returns {{
   *  deposit: number
   *  interestAmount: number
   *  interestPercentage: number
   * }}
   */
  async fetchWalletStatus(data) {
    return await this.get({
      endPoint: "/api/movements/status" + (data && data.userId ? `/${data.userId}` : ''),
    })
  }

  async fetchCommissionsStatus(data) {
    return await this.get({
      endPoint: "/api/commissions/status" + (data && data.userId ? `/${data.userId}` : ''),
    })
  }

  async dashboardFetch() {
    return await this.get({
      endPoint: "/api/dashboards"
    })
  }

  async communicationsFetch(type) {
    return await this.get({
      endPoint: "/api/communications" + (type ? `?t=${type}` : "")
    })
  }

  async communicationsFetchReceivers(messageType) {
    return await this.get({
      endPoint: "/api/communications/receivers?m=" + messageType,
    })
  }

  async conversationFetch(id) {
    return await this.get({
      endPoint: `/api/communications/conversations/${id}`
    })
  }

  async communicationSend(body) {
    return await this._call({
      method: "POST",
      endPoint: `/api/communications`,
      body,
      uploadMode: true
    })
  }

  async messagesSetAsRead(body) {
    return await this._call({
      method: "PATCH",
      endPoint: `/api/communications/messages`,
      body,
    })
  }
}

export default (context, inject) => {
  const apiCalls = new ApiCalls(context)

  inject('apiCalls', apiCalls)

  if (!context.$apiCalls) {
    context.$apiCalls = apiCalls
  }
}
