import { BasicEnum } from '../classes/BasicEnum'

/**
 * @enum
 */
class MessageTypes extends BasicEnum {

  constructor() {
    super('UserRoles')

    /** Newsletter email */
    this.NEWSLETTER = 1

    /** Email containing various service communications. Can be sent to multiple users */
    this.SERVICE = 2

    /** Direct email to a user for any reason */
    this.CONVERSATION = 3

    /** Simple notification of any kind. This doesn't expect an answer */
    this.NOTIFICATION = 4

    this.BUG_REPORT = 5


    this.data = {
      [this.NEWSLETTER]: {
        id: 'newsletter',
      },
      [this.SERVICE]: {
        id: 'service',
      },
      [this.CONVERSATION]: {
        id: 'conversation',
      },
      [this.NOTIFICATION]: {
        id: 'notification',
      },
      [this.BUG_REPORT]: {
        id: 'bug_report',
      }
    }
  }
}

export default new MessageTypes()
