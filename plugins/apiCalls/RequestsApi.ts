import {BasicApiCall} from "~/classes/BasicApiCall";

export class RequestsApi extends BasicApiCall {
  async revert(data: { id: string, reason: string }) {
    return await this._call({
      method: "PUT",
      endPoint: `/api/requests/${data.id}/revert`,
      body: {reason: data.reason}
    })
  }
}
