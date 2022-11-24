export interface SystemTotalsInDto {
  depositTotal: number;
  interestsTotal: number;
  deposit: number,
  interests: number;
  details: Record<string, number>
}


export interface SystemTotalsOutDto {
  withdrewInterests: number;
  goldWithdrewInterests: number;
  withdrewDeposit: number;
}
