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
}
