import {MenuListItem} from "~/@types/components/MenuListItem";
import {BlockData} from "~/config/blocks/dashboardBlocks";

interface LargeCard {
  id: string,
  title: string
  filter?: string
  menu?: ((card: LargeCard) => MenuListItem[])
  type?: 'inline' | null
  items: BlockData[] | ((card: LargeCard) => BlockData[])
}

interface DashboardData {
  validatedUsers: any[],
  pendingRequests: any[],
  pendingSignatures: any[],
  systemTotals: {
    deposit: number,
    interests: number,
    withdrewDeposit: number,
    withdrewInterests: number
  },
  commissionTotals: {
    total: number,
    withdrew: number,
    reinvested: number,
  },
  newUsers: {
    thisMonth: number,
    last3Months: number,
    last6Months: number,
    last12Months: number,
  },
  usersStatus: {
    draft: number,
    active: number,
    pendingAccess: number,
    pendingSignature: number,
    suspended: number
  },
  agentsNewUsers: {
    _id: string
    totalUsers: number
    agent: {
      _id: string,
      firstName: string,
      lastName: string
    }
    users: {
      thisMonth: number
      last3Months: number
      last6Months: number
      last12Months: number
    }
  }[],
  agentsTotalEarnings: {
    _id: string
    agent: {
      _id: string,
      firstName: string
      lastName: string
    }
    count: number
    totalAmount: number
    totals: {
      thisMonth: number
      last3Months: number
      last6Months: number
      last12Months: number
    }
  }[]
}
