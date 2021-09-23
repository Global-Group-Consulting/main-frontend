import {BasicApiCall} from "~/classes/BasicApiCall";

export class GeolocationApi extends BasicApiCall {
  async countries() {
    return this.get({endPoint: "/api/geo/countries"})
  }

  async regions() {
    return this.get({endPoint: "/api/geo/ita/regions"})
  }

  async provinces() {
    return this.get({endPoint: "/api/geo/ita/provinces"})
  }
}
