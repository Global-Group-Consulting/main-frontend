import { BasicApiCall } from '~/classes/BasicApiCall'

class ApiCalls extends BasicApiCall {
  constructor(context) {
    super(context)
  }

  async userCreate(data) {
    return await this._call({
      method: "POST",
      endPoint: `/api/users`,
      body: data
    })
  }

  async userUpdate(data) {
    return await this._call({
      method: "PATCH",
      endPoint: `/api/users/${data.id}`,
      body: data
    })
  }

  async userDelete(userId) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/users/${userId}`
    })
  }

  async fetchAllUsers() {
    return (await this.get({
      endPoint: `/api/users`
    })
    )
  }

  async fetchUserDetails(_id) {
    return (await this.get({
      endPoint: `/api/users/` + _id
    })
    )
  }

  async dashboardData() {
    return await this.get({
      endPoint: "/api/dashboards"
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
