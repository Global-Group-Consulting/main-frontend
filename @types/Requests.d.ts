import {User} from "~/@types/UserFormData";

export interface RequestFormData {
  wallet: number
  type: number
  availableAmount: number
  currency: number
  gold: boolean
  clubPack: string
  status: number
  requestState: number
  id: string
  _id: string
  autoWithdrawlAllRecursively: any
  autoWithdrawlAll: any
  autoWithdrawlAllRevoked: any
  conversation: any
  requestAttachment: any

  amount: number | string
  amountOriginal?: number
  amountBrite?: number
  amountEuro?: number
  briteConversionPercentage?: number
  
  clubRepayment?: boolean

  rejectReason: string
  created_at: string
  completed_at: string
  cancelReason: string
  notes: string
  userId: string
  user: User
  typeClub: any
  initialMovement: any
  targetUser: User
  targetUserId: string
  canCancel: boolean
  goldAmount: number

  briteMovementId: string
  movementId: string
  
  files?: any[]

}
