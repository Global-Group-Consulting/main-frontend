import { Alerts } from "../plugins/alerts"

export interface AlertsPlugin extends Alerts {
  askBeforeAction({
    key: string,
    data: { },
    settings: {
      confirmButtonColor: string,
      cancelButtonColor: string
    },
    preConfirm
  })
}
