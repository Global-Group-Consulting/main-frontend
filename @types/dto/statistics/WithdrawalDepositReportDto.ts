import { User } from '~/@types/UserFormData'

export interface WithdrawalDepositReportDto {
  _id: string,
  total: number,
  user: Pick<User, '_id' | 'firstName' | 'lastName'>
}
