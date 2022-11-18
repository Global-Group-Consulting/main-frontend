import { User } from '~/@types/UserFormData'

export interface WithdrawalInterestReportDto {
  _id: string,
  total: number,
  user: Pick<User, '_id' | 'firstName' | 'lastName'>
}
