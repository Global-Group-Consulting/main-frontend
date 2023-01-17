import {BasicApiCall} from "~/classes/BasicApiCall";

export class CalendarEventsApi extends BasicApiCall {
  async all() {
    return this.get({endPoint: "/api/calendarEvents/"})
  }

}
