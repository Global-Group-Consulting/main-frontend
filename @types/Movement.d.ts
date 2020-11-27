
export interface IMovement {
  // Soldi attualmente disponibili già con tutto calcolato.
  deposit: number,
  depositOld: number,

  // Valore di quanto cambiato, indipendentemente se deposito o interesse maturato
  amountChange: number,

  // Tipologia di movimento (versamento, reinvestimento, ecc.)
  movementType: number,

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

export interface AddMovementDto {
  userId: string
  movementType: number
  amountChange: number
}
