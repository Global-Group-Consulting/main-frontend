// @ts-ignore

import { BasicApiCall } from '../classes/BasicApiCall'

import UserRoles from '../enums/UserRoles'
import { Plugin } from '@nuxt/types'
import { enums } from '~/plugins/enums'
import { AclPermission } from '~/@types/Acl/Permissions'
import { AclRole } from '~/@types/Acl/Roles'
import { RequestFormData } from '~/@types/Requests'
import { AgentBriteApi } from '~/plugins/apiCalls/AgentBriteApi'
import { UserApi } from '~/plugins/apiCalls/UserApi'
import { MagazineApi } from '~/plugins/apiCalls/Magazine'
import { FilesApi } from '~/plugins/apiCalls/FilesApi'
import { RequestsApi } from '~/plugins/apiCalls/RequestsApi'
import { ReportsApi } from '~/plugins/apiCalls/ReportsApi'
import { FiltersApi } from '~/plugins/apiCalls/FiltersApi'
import { ClubApi } from '~/plugins/apiCalls/ClubApi'
import { GeolocationApi } from '~/plugins/apiCalls/GeolocationApi'
import { NewsApi } from '~/plugins/apiCalls/News'
import { SelectOptionsApi } from '~/plugins/apiCalls/SelectOptionsApi'
import { StatisticsApi } from '~/plugins/apiCalls/StatisticsApi'
import { MovementApi } from '~/plugins/apiCalls/Movement'
import { CalendarEventsApi } from '~/plugins/apiCalls/CalendarEventsApi'
import { CalendarCategoriesApi } from '~/plugins/apiCalls/CalendarCategoriesApi'
import { CalendarEventCommentsApi } from '~/plugins/apiCalls/CalendarEventCommentsApi'
import { NotificationsApi } from '~/plugins/apiCalls/NotificationsApi'
import { AnalyticsApi } from '~/plugins/apiCalls/AnalyticsApi'

interface IApiCalls extends ApiCalls {
  [key: string]: any
}

// @ts-ignore
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
  public agentBriteApi!: AgentBriteApi
  public userApi!: UserApi
  public magazine!: MagazineApi
  public files!: FilesApi
  public requests!: RequestsApi
  public reports!: ReportsApi
  public filters!: FiltersApi
  public club!: ClubApi
  public geo!: GeolocationApi
  public news!: NewsApi
  public selectOptions!: SelectOptionsApi
  public statisticsApi!: StatisticsApi
  public movementApi!: MovementApi
  public calendarEventsApi!: CalendarEventsApi
  public calendarCategoriesApi!: CalendarCategoriesApi
  public calendarEventCommentsApi!: CalendarEventCommentsApi
  public notificationsApi!: NotificationsApi
  public analyticsApi!: AnalyticsApi
  
  constructor (context: any) {
    super(context)
    
    this.agentBriteApi = new AgentBriteApi(context)
    this.userApi = new UserApi(context)
    this.magazine = new MagazineApi(context)
    this.files = new FilesApi(context)
    this.requests = new RequestsApi(context)
    this.reports = new ReportsApi(context)
    this.filters = new FiltersApi(context)
    this.club = new ClubApi(context)
    this.geo = new GeolocationApi(context)
    this.news = new NewsApi(context)
    this.selectOptions = new SelectOptionsApi(context)
    this.statisticsApi = new StatisticsApi(context)
    this.movementApi = new MovementApi(context)
    this.calendarEventsApi = new CalendarEventsApi(context)
    this.calendarCategoriesApi = new CalendarCategoriesApi(context)
    this.calendarEventCommentsApi = new CalendarEventCommentsApi(context)
    this.notificationsApi = new NotificationsApi(context)
    this.analyticsApi = new AnalyticsApi(context)
  }
  
  async userCreate (data: any) {
    return await this._call({
      method: 'POST',
      endPoint: `/api/users`,
      body: data,
      uploadMode: true
    })
  }
  
  async userUpdate (data: any) {
    return await this._call({
      method: 'PATCH',
      endPoint: `/api/users/${data.id}`,
      body: data,
      uploadMode: true
    })
  }
  
  async userDelete (userId: string) {
    return await this._call({
      method: 'DELETE',
      endPoint: `/api/users/${userId}`
    })
  }
  
  async userApprove (userId: string) {
    return await this._call({
      method: 'PUT',
      endPoint: `/api/users/${userId}/approve`
    })
  }
  
  async userSendEmailActivation (userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/sendEmailActivation`
    })
  }
  
  /**
   * @param {{id: string, status: string}} data
   */
  async userChangeStatus (data: any) {
    return await this.post({
      endPoint: `/api/users/${data.id}/status`,
      body: {
        status: data.status
      }
    })
  }
  
  async userConfirmDraft (userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/confirmDraft`
    })
  }
  
  async userValidate (userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/validate`
    })
  }
  
  async userResendContract (userId: string) {
    return await this.post({
      endPoint: `/api/users/${userId}/resendContract`
    })
  }
  
  /**
   *
   * @param {{userId: string, message: string, checkedFields: string[]}} data
   * @returns {Promise<void>}
   */
  async userIncomplete (data: any) {
    return await this.post({
      endPoint: `/api/users/${data.userId}/incomplete`,
      body: data
    })
  }
  
  /**
   *
   * @param {{userId: string, suspend: boolean}} data
   * @returns {Promise<void>}
   */
  async userSuspend (data: any) {
    return await this._call({
      endPoint: `/api/users/${data.userId}/suspend`,
      method: 'PATCH',
      body: { status: data.status }
    })
  }
  
  async fetchAllUsers () {
    return await this.get({
      endPoint: `/api/users`
    })
  }
  
  async fetchUserDetails (_id: string) {
    return (await this.get({
        endPoint: `/api/users/` + _id
      })
    )
  }
  

  
  async importContract (body: any) {
    return (await this._call({
      method: 'POST',
      endPoint: `/api/users/${body.userId}/importContract`,
      body,
      uploadMode: true
    }))
  }
  
  async dashboardData () {
    return await this.get({
      endPoint: '/api/dashboards'
    })
  }
  
  async authForgot (data: any) {
    return await this.post({
      endPoint: '/api/auth/forgot',
      body: data,
      setLoading: true
    })
  }
  
  async authRecover (data: any) {
    return await this.post({
      endPoint: '/api/auth/resetPassword',
      body: data,
      setLoading: true
    })
  }
  
  async authActivate (data: any) {
    return await this.post({
      endPoint: '/api/auth/activate',
      body: data,
      setLoading: true
    })
  }
  
  async downloadFile (fileId: string) {
    return await this.get({
      endPoint: `/api/files/${fileId}`,
      downloadMode: true
    })
  }
  
  async deleteFile (fileId: string) {
    return await this._call({
      method: 'DELETE',
      endPoint: `/api/files/${fileId}`
    })
  }
  
  async fetchRequests () {
    return await this.get({
      endPoint: `/api/requests`
    })
  }
  
  async readRequest (id: string) {
    return await this.get({
      endPoint: `/api/requests/${id}`
    })
  }
  
  async readRequestTargetUser (id: string) {
    return await this.get({
      endPoint: `/api/requests/targetUser/${id}`
    })
  }
  
  async downloadRequestsReport (months: string) {
    return await this._call({
      method: 'GET',
      endPoint: `/api/docs/reports/requests?m=${months}`,
      downloadMode: true
    })
  }
  
  async downloadMovementsReport (userId: string) {
    return await this._call({
      method: 'GET',
      endPoint: `/api/docs/reports/movements?`,
      params: { userId },
      downloadMode: true
    })
  }
  
  
  async fetchCommissionsStatus (userId?: string) {
    return await this.get({
      endPoint: '/api/commissions/status' + (userId ? `/${userId}` : '')
    })
  }
  
  async fetchCommissionsList (userId?: string) {
    return await this.get({
      endPoint: '/api/commissions/list' + (userId ? `/${userId}` : '')
    })
  }
  
  async fetchCommissionsAvailable (userId: string) {
    return await this.get({
      endPoint: '/api/commissions/available/' + userId
    })
  }
  
  async dashboardFetch (userId?: string, params?: any) {
    return await this.get({
      endPoint: '/api/dashboards' + (userId ? '/' + userId : ''),
      params
    })
  }
  
  async communicationsFetch (type?: string) {
    return await this.get({
      endPoint: '/api/communications' + (type ? `?t=${type}` : '')
    })
  }
  
  async communicationsFetchReceivers (messageType: string) {
    return await this.get({
      endPoint: '/api/communications/receivers?m=' + messageType
    })
  }
  
  async conversationFetch (id: string) {
    return await this.get({
      endPoint: `/api/communications/conversations/${id}`
    })
  }
  
  async communicationSend (body: any) {
    return await this._call({
      method: 'POST',
      endPoint: `/api/communications`,
      body,
      uploadMode: true
    })
  }
  
  async messagesSetAsRead (body: any) {
    return await this._call({
      method: 'PATCH',
      endPoint: `/api/communications/messages`,
      body
    })
  }
  
  async getClientsList (userId: string) {
    return await this.get({
      endPoint: `/api/users/${userId}/clientsList`
    })
  }
  
  async getContractLogs (userId: string) {
    return await this.get({
      endPoint: `/api/users/${userId}/contractLogs`
    })
  }
  
  async aclReadPermissions () {
    return await this.get({ endPoint: `/api/acl/permissions` })
  }
  
  async aclCreatePermissions (data: Partial<AclPermission>) {
    return await this._call({ endPoint: `/api/acl/permissions`, body: data, method: 'POST' })
  }
  
  async aclUpdatePermissions (data: Partial<AclPermission>) {
    return await this._call({ endPoint: `/api/acl/permissions/${data.id}`, body: data, method: 'PUT' })
  }
  
  async aclUpdateUsers (data: Partial<AclPermission>) {
    return await this._call({ endPoint: `/api/users/${data.id}`, body: data, method: 'PATCH' })
  }
  
  async aclDeletePermissions (id: string) {
    return await this._call({ endPoint: `/api/acl/permissions/${id}`, method: 'DELETE' })
  }
  
  async aclReadRoles () {
    return await this.get({ endPoint: `/api/acl/roles` })
  }
  
  async aclCreateRoles (data: Partial<AclRole>) {
    return await this._call({ endPoint: `/api/acl/roles`, body: data, method: 'POST' })
  }
  
  async aclUpdateRoles (data: Partial<AclRole>) {
    return await this._call({ endPoint: `/api/acl/roles/${data.id}`, body: data, method: 'PUT' })
  }
  
  async aclDeleteRoles (id: string) {
    return await this._call({ endPoint: `/api/acl/roles/${id}`, method: 'DELETE' })
  }
  
  async fetchClubUsers () {
    return await this.get({
      endPoint: `/api/club/users`
    })
  }
  
  async clubFetchBrites (userId: string) {
    return await this.get({
      endPoint: `/api/club/${userId}`
    })
  }
  
  async clubFetchBlocks (userId: string) {
    return await this.get({
      endPoint: `/api/club/${userId}/blocks`
    })
  }
  
  async clubAddBrites (userId: string, data: any) {
    return await this.post({
      endPoint: `/api/club/${userId}`,
      body: data
    })
  }
  
  async clubUseBrites (userId: string, data: any) {
    return await this.post({
      endPoint: `/api/club/${userId}/use`,
      body: data
    })
  }
  
  async commissionsAdd (userId: string, data: any) {
    return await this.post({
      endPoint: `/api/commissions/${userId}/add`,
      body: data
    })
  }
  
  async commissionsCancellation (userId: string, data: any) {
    return await this.post({
      endPoint: `/api/commissions/${userId}/cancellation`,
      body: data
    })
  }
  
  async clubRemoveBrites (userId: string, data: any, semesterId: string) {
    return await this.post({
      endPoint: `/api/club/${userId}/remove`,
      body: Object.assign({}, data, { semesterId })
    })
  }
  
  async readGlobalSettings () {
    return await this.get({
      endPoint: '/api/settings'
    })
  }
  
  async readUserSettings (userId: string) {
    return await this.get({
      endPoint: '/api/settings/' + userId
    })
  }
  
  async saveSettings (data: any) {
    return await this.post({
      endPoint: '/api/settings',
      body: data
    })
  }
}

const apiCallsPlugin: Plugin = (context, inject) => {
  const apiCalls = new ApiCalls(context)
  
  inject('apiCalls', apiCalls)
}

export default apiCallsPlugin
