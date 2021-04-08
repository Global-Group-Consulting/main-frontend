export interface IMovement {
  // Soldi attualmente disponibili già con tutto calcolato.
  deposit: number,
  depositOld: number,

  // Valore di quanto cambiato, indipendentemente se deposito o interesse maturato
  amountChange: number,

  // Tipologia di movimento (versamento, reinvestimento, ecc.)
  movementType: number,

  commissionType: string,

  // Percentuale di interesse attualmente attiva.
  interestPercentage: number,

  // Interesse attualmente in pancia, quindi somma calcolata.
  interestAmount: number,
  interestAmountOld: number,

  // Riferimento al movimento che sta stornando
  cancelRef: string,

  // Motivo dello storno. al momento non serve, ma potrebbe
  cancelReason: string,

  created_at: Date
}

export interface Movement {
  amountChange: number
  created_at: string
  deposit: number
  depositOld: number
  id: string
  interestAmount: number
  interestAmountOld: number
  interestPercentage: number
  movementType: number
  updated_at: string
  userId: string
}

export interface AddMovementDto {
  userId: string
  movementType: number
  amountChange: number
}
