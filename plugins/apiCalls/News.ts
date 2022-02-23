import { BasicApiCall } from "~/classes/BasicApiCall";
import { FormMagazineCreate, IMagazine } from "~/@types/Magazine";
import { INews, NewsCreateDto, NewsStatus, NewsUpdateDto } from '~/@types/News';

export class NewsApi extends BasicApiCall {
  async index (): Promise<INews[]> {
    return this.get({
      endPoint: "api/ext/news/news",
    })
  }

  async getUnread (): Promise<INews[]> {
    return this.get({
      endPoint: "api/ext/news/news",
    })
  }
/*
  async create (newsData: NewsCreateDto): Promise<INews> {
    return this.post({
      endPoint: "api/news",
      body: newsData,
      uploadMode: true
    })
  }

  async update (newsData: NewsUpdateDto, newsId: string): Promise<INews> {
    return this._call({
      method: "PUT",
      endPoint: "api/news/" + newsId,
      body: newsData,
      uploadMode: true
    })
  }*/

  async setAsRead (newsId: string): Promise<NewsStatus> {
    return this._call({
      method: "PATCH",
      endPoint: "api/ext/news/news/" + newsId + "/read",
    })
  }
/*
  async delete (newsId: string) {
    return this._call({
      method: "DELETE",
      endPoint: "api/news/" + newsId
    })
  }*/
}
