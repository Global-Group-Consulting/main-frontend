import { BasicEnum } from '../classes/BasicEnum'

class ErrorMessages extends BasicEnum {
  constructor () {
    super()

    this.INVALID_OTP         = 'invalid-otp'
    this.INVALID_OTP_EXPIRED = 'invalid-otp-expired'

    this.USER_NOT_FOUND   = 'user-not-found'
    this.USER_NOT_CREATED = 'user-not-created'

    this.LOGIN_NOT_FOUND = 'login-not-found'

    this.ENCRYPTION_FAILED = 'encryption-failed'
  }
}

export default new ErrorMessages()
