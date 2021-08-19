import {BasicApiCall} from "~/classes/BasicApiCall";
import {User} from "~/@types/UserFormData";

export class FiltersApi extends BasicApiCall {
  async fetchUsers(filters: any = {}): Promise<User[]> {
    return await this._call({
      method: "GET",
      endPoint: `/api/filters/users`,
      body: {
        filters
      }
    })
  }

  async fetchAgents(filters: any = {}): Promise<User[]> {
    return await this._call({
      method: "GET",
      endPoint: `/api/filters/agents`,
      body: {
        filters
      }
    })
  }
}
