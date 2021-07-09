import {BasicApiCall} from "~/classes/BasicApiCall";

export class FilesApi extends BasicApiCall {
  async show(fileId: string) {
    return await this.get({
      endPoint: `/api/files/${fileId}/meta`,
    })
  }

  async download(fileId: string) {
    return await this.get({
      endPoint: `/api/files/${fileId}`,
      downloadMode: true
    })
  }

  async delete(fileId: string) {
    return await this._call({
      method: "DELETE",
      endPoint: `/api/files/${fileId}`
    })
  }
}
