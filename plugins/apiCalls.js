import { BasicApiCall } from '~/classes/BasicApiCall'

class ApiCalls extends BasicApiCall {
  constructor (context) {
    super(context)
  }

  userUpdate () {

  }

  async fetchAllUsers () {
    return (await this.get({
        endPoint: `/api/users`
      })
    )
  }

  async fetchUserDetails (_id) {
    return (await this.get({
        endPoint: `/api/users/` + _id
      })
    )
  }
}

export default (context, inject) => {
  const apiCalls = new ApiCalls(context)

  inject('apiCalls', apiCalls)

  if (!context.$apiCalls) {
    context.$apiCalls = apiCalls
  }
}
