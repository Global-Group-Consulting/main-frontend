import {BasicApiCall} from "~/classes/BasicApiCall";
import {AgentBrite} from "~/@types/AgentBrite";

export class AgentBriteApi extends BasicApiCall {
  async index(userId: string): Promise<AgentBrite[]> {
    return this.get({
      endPoint: "api/agentBrites",
      params: {
        userId
      }
    })
  }

  async statistics(userId?: string) {
    return await this.get({
      endPoint: "/api/agentBrites/statistics" + (userId ? `/${userId}` : ''),
    })
  }

  async manual_add(formData: any, userId: string) {
    return await this._call({
      method: "patch",
      endPoint: "/api/agentBrites/add/" + userId,
      body: formData
    })
  }

  async manual_remove(formData: any, userId: string) {
    return await this._call({
      method: "patch",
      endPoint: "/api/agentBrites/remove/" + userId,
      body: formData
    })
  }
}
