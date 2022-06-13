export interface CalcTotalsDto {
  semesterId: string;
  totalRemaining: number;
  totalUsable: number;
  totalUsed: number;
  totalEarned: number;
  expiresAt: string
  usableFrom: string
  usableNow: boolean
  packs: CalcTotalPacks
}

export interface CalcTotalPacks {
  '_none'?: CalcTotalPackDetails
  
  'basic'?: CalcTotalPackDetails
  
  'fast'?: CalcTotalPackDetails
  
  'premium'?: CalcTotalPackDetails
}

export interface CalcTotalPackDetailsSupTotals {
  interest_recapitalized: number;
  deposit_added: number;
  deposit_removed: number;
  deposit_transferred: number;
  deposit_used: number;
}

export interface CalcTotalPackDetails {
  totalRemaining: number;
  totalUsable: number;
  totalUsed: number;
  totalEarned: number;
  forcedZero: boolean;
  subTotals: CalcTotalPackDetailsSupTotals
}

export interface DashboardSemesterExpirations {
  usable: number;
  remaining: number;
  date: string
}

export interface DashboardBritesData {
  totalRemaining: number;
  totalUsable: number;
  expirations: DashboardSemesterExpirations[];
  semesters: CalcTotalsDto[]
}
