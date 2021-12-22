import {BasicApiCall} from "~/classes/BasicApiCall";
import {FormMagazineCreate, IMagazine} from "~/@types/Magazine";
import { INews } from '~/@types/News';

export class NewsApi extends BasicApiCall {
  async index(): Promise<INews[]> {
    return this.get({
      endPoint: "api/news",
    })
  }

  async current(): Promise<IMagazine[]> {
    return this.get({
      endPoint: "api/magazine/current",
    })
  }

  async show(magazineId: string): Promise<IMagazine> {
    return this.get({
      endPoint: "api/magazine/" + magazineId,
    })
  }

  async create(magazineData: FormMagazineCreate): Promise<IMagazine> {
    return this.post({
      endPoint: "api/magazine",
      body: magazineData,
      uploadMode: true
    })
  }

  async update(magazineData: FormMagazineCreate, magazineId: string): Promise<IMagazine> {
    return this._call({
      method: "PATCH",
      endPoint: "api/magazine/" + magazineId,
      body: magazineData,
      uploadMode: true
    })
  }

  async delete(magazineId: string) {
    return this._call({
      method: "DELETE",
      endPoint: "api/magazine/" + magazineId
    })
  }
}
