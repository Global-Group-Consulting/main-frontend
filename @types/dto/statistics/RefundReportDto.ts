import { User } from '~/@types/UserFormData'

export interface RefundReportDto {
  _id: string,
  totalSum: number,
  totals: {
    total: number;
    fromClub: boolean;
  }[],
  user: Pick<User, '_id' | 'firstName' | 'lastName'>
}
