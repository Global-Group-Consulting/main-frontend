export interface ClubMovement {
  deposit: number
  depositOld: number

  amountChange: number

  movementType: string

  /**
   * Annual semestre that refers to
   * Indicates only if is the first or the second
   */
  referenceSemester: 1 | 2

  notes: string

  requestId?: string
  movementId?: string
  userId: string

  // User that has created this movement in case is manual
  created_by?: string

  id: string
  created_at: Date
  updated_at: Date
}
