import { User } from '~/@types/UserFormData'

export interface AgentNewUsersCountDto {
  _id: string,
  totalUsers: number;
  agent: Pick<User, '_id' | 'firstName' | 'lastName' | 'email' | 'contractNumber' | 'clubPack' | 'referenceAgent'>;
}
