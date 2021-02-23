import {BasicApiCall} from '../classes/BasicApiCall'

import UserRoles from "../enums/UserRoles"
import {Plugin} from "@nuxt/types";
import {enums} from "~/plugins/enums";
import {AclPermission} from "~/@types/Acl/Permissions";
import {AclRole} from "~/@types/Acl/Roles";


interface IApiCalls extends ApiCalls {
  [key: string]: any
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $apiCalls: IApiCalls
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $apiCalls: IApiCalls
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $apiCalls: IApiCalls
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $apiCalls: IApiCalls
  }
}

export class ApiCalls extends BasicApiCall {
  constructor(context: any) {
    super(context)
  }

  async userCreate(data: any) {
    return await this._call({
      method: "POST",
      endPoint: `/api/users`,
      body: data,
      uploadMode: true
    })
  }

  async userUpdate(data: any) {
    return await this._call({
      method: "PATCH",
      endPoint: `/api/users/${data.id}`,
      body: data,
      uploadMode: true
    })
  }

  async userDelete(userId: string) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/users/${userId}`
    })
  }

  async userApprove(userId: string) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/users/${userId}/approve`
    })
  }

  async userSendEmailActivation(userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/sendEmailActivation`
    })
  }

  /**
   * @param {{id: string, status: string}} data
   */
  async userChangeStatus(data: any) {
    return await this.post({
      endPoint: `/api/users/${data.id}/status`,
      body: {
        status: data.status
      }
    })
  }

  async userConfirmDraft(userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/confirmDraft`
    })
  }

  async userValidate(userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/validate`
    })
  }

  /**
   *
   * @param {{userId: string, message: string, checkedFields: string[]}} data
   * @returns {Promise<void>}
   */
  async userIncomplete(data: any) {
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

  async fetchUserDetails(_id: string) {
    return (await this.get({
        endPoint: `/api/users/` + _id
      })
    )
  }

  async fetchMovementsList(_id: string) {
    return (await this.get({
      endPoint: `/api/movements` + (_id ? `/${_id}` : '')
    }))
  }

  async importMovementsList(body: any) {
    return (await this._call({
      method: "POST",
      endPoint: `/api/movements/import`,
      body,
      uploadMode: true
    }))
  }

  async importContract(body: any) {
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

  async authForgot(data: any) {
    return await this.post({
      endPoint: "/api/auth/forgot",
      body: data,
      setLoading: true
    })
  }

  async authRecover(data: any) {
    return await this.post({
      endPoint: "/api/auth/resetPassword",
      body: data,
      setLoading: true
    })
  }

  async authActivate(data: any) {
    return await this.post({
      endPoint: "/api/auth/activate",
      body: data,
      setLoading: true
    })
  }

  async downloadFile(fileId: string) {
    return await this.get({
      endPoint: `/api/files/${fileId}`,
      downloadMode: true
    })
  }

  async deleteFile(fileId: string) {
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

  async createRequest(data: any) {
    return await this.post({
      endPoint: `/api/requests`,
      body: data,
      uploadMode: true
    })
  }

  async deleteRequest(data: any) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/requests/${data.id}`,
    })
  }

  async acceptRequest(data: any, paymentDocDate: any) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/approve`,
      body: {
        paymentDocDate
      }
    })
  }

  async rejectRequest(data: any) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/reject`,
      body: {reason: data.reason}
    })
  }

  async cancelRequest(data: any) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/cancel`,
      body: {reason: data.reason}
    })
  }

  async downloadRequestReceipt(reqId: string) {
    return await this._call({
      method: "GET",
      endPoint: `/api/docs/receipt/deposit?id=${reqId}`,
      downloadMode: true
    })
  }

  async downloadRequestsReport(months: string) {
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
  async fetchWalletStatus(data: any) {
    return await this.get({
      endPoint: "/api/movements/status" + (data && data.userId ? `/${data.userId}` : ''),
    })
  }

  async fetchCommissionsStatus(data: any) {
    return await this.get({
      endPoint: "/api/commissions/status" + (data && data.userId ? `/${data.userId}` : ''),
    })
  }

  async dashboardFetch() {
    return await this.get({
      endPoint: "/api/dashboards"
    })
  }

  async communicationsFetch(type: string) {
    return await this.get({
      endPoint: "/api/communications" + (type ? `?t=${type}` : "")
    })
  }

  async communicationsFetchReceivers(messageType: string) {
    return await this.get({
      endPoint: "/api/communications/receivers?m=" + messageType,
    })
  }

  async conversationFetch(id: string) {
    return await this.get({
      endPoint: `/api/communications/conversations/${id}`
    })
  }

  async communicationSend(body: any) {
    return await this._call({
      method: "POST",
      endPoint: `/api/communications`,
      body,
      uploadMode: true
    })
  }

  async messagesSetAsRead(body: any) {
    return await this._call({
      method: "PATCH",
      endPoint: `/api/communications/messages`,
      body,
    })
  }

  async getClientsList(userId: string) {
    return await this.get({
      endPoint: `/api/users/${userId}/clientsList`
    })
  }


  async aclReadPermissions() {
    return await this.get({endPoint: `/api/acl/permissions`})
  }

  async aclCreatePermissions(data: Partial<AclPermission>) {
    return await this._call({endPoint: `/api/acl/permissions`, body: data, method: "POST"})
  }

  async aclUpdatePermissions(data: Partial<AclPermission>) {
    return await this._call({endPoint: `/api/acl/permissions/${data.id}`, body: data, method: "PUT"})
  }

  async aclUpdateUsers(data: Partial<AclPermission>) {
    return await this._call({endPoint: `/api/users/${data.id}`, body: data, method: "PATCH"})
  }


  async aclDeletePermissions(id: string) {
    return await this._call({endPoint: `/api/acl/permissions/${id}`, method: "DELETE"})
  }

  async aclReadRoles() {
    return await this.get({endPoint: `/api/acl/roles`})
  }

  async aclCreateRoles(data: Partial<AclRole>) {
    return await this._call({endPoint: `/api/acl/roles`, body: data, method: "POST"})
  }

  async aclUpdateRoles(data: Partial<AclRole>) {
    return await this._call({endPoint: `/api/acl/roles/${data.id}`, body: data, method: "PUT"})
  }

  async aclDeleteRoles(id: string) {
    return await this._call({endPoint: `/api/acl/roles/${id}`, method: "DELETE"})
  }


  async fetchClubUsers() {
    return await this.get({
      endPoint: `/api/club/users`
    })
  }

  async clubFetchBrites(userId: string) {
    return await this.get({
      endPoint: `/api/club/${userId}`,
    })
  }

  async clubFetchBlocks(userId: string) {
    return await this.get({
      endPoint: `/api/club/${userId}/blocks`,
    })
  }

  async clubAddBrites(userId: string, data: any) {
    return await this.post({
      endPoint: `/api/club/${userId}`,
      body: data
    })
  }
}

const apiCallsPlugin: Plugin = (context, inject) => {
  const apiCalls = new ApiCalls(context)

  inject('apiCalls', apiCalls)
}

export default apiCallsPlugin
