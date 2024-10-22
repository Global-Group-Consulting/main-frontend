import AgentTeamType from "~/enums/AgentTeamType";
import {SignRequestLog} from "~/@types/SignRequest";
import {AclUserRoles} from "~/enums/AclUserRoles";

export interface User {
  id: string,
  _id: string,
  role: number
  personType: string
  businessName: string
  vatNumber: string
  firstName: string
  lastName: string
  fiscalCode: string
  gender: string
  birthCountry: string
  birthProvince: string
  birthCity: string
  birthDate: string
  docType: string
  docNumber: string
  docExpiration: string
  businessCountry: string
  businessRegion: string
  businessProvince: string
  businessCity: string
  businessZip: string
  businessAddress: string
  legalRepresentativeCountry: string
  legalRepresentativeRegion: string
  legalRepresentativeProvince: string
  legalRepresentativeCity: string
  legalRepresentativeZip: string
  legalRepresentativeAddress: string
  email: string
  mobile: string
  phone: string
  contractNumber: string
  contractDate: string
  contractPercentage: string
  contractIban: string
  contractBic: string
  contractInitialPaymentMethod: string
  contractInitialPaymentMethodOther: string,
  referenceAgent: string
  referenceAgentData: any
  accountCreatedAt: string
  accountUpdatedAt: string
  accountActivatedAt: string
  accountVerifiedAt: string
  contractSignedAt: string
  signinLogs: SignRequestLog[]
  contractFiles: any[]
  contractImported: boolean
  account_status: string
  files: any[]
  gold: boolean
  hasSubAgents: boolean
  agentTeamType: typeof AgentTeamType,
  permissions: string[],
  superAdmin: boolean
  clubCardNumber: string
  clubPack: string
  autoWithdrawlAll: string | null
  autoWithdrawlAllRecursively: string | null
  suspended: boolean
  /**
   * @deprecated
   */
  clientsCount: number
  clients: number
  commissionsAssigned: any
  roles: AclUserRoles[]
  userOnlyClub: boolean
}

export interface UserDataSchema extends User {
}
