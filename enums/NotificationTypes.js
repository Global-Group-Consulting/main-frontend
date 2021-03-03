import {BasicEnum} from '../classes/BasicEnum'

/**
 * @enum
 */
class NotificationTypes extends BasicEnum {
  constructor() {
    super('NotificationTypes')

    this.USER_VALIDATE = "user_validate"
    this.USER_INCOMPLETE = "user_incomplete"
    this.USER_REVALIDATE = "user_revalidate"
    this.USER_SIGN_REQUEST = "user_sign_request"
    this.USER_APPROVED = "user_approved"

    this.REQUEST_DEPOSIT = "request_deposit"
    this.REQUEST_DEPOSIT_COLLECT = "request_deposit_collect"
    this.REQUEST_APPROVED = "request_approved"
    this.REQUEST_REJECTED = "request_rejected"
    this.REQUEST_CANCELLED = "request_cancelled"

    this.MESSAGE_REPORT = "message_report"
    this.MESSAGE_CHAT = "message_chat"
    this.MESSAGE_COMMUNICATION = "message_communication"
  }
}

export default new NotificationTypes()
