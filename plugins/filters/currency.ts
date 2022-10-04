export function formatCurrency (value: number, currencyStart = false) {
  if (value === undefined) {
    return null
  }
  
  const toReturn = [new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: 2,
    // style: 'decimal',
    // currency: "EUR",
  }).format(value)]
  
  if (currencyStart) {
    toReturn.unshift('€')
  } else {
    toReturn.push('€')
  }
  
  return toReturn.join(' ')
}

export function formatBrites (value: number, currPosition: 'start' | 'end' = 'start') {
  if (value === undefined) {
    return null
  }
  const formattedValue = new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: 0
  }).format(value)
  const icon = '<i class=\'gc-icon-brite-logo\'></i>'
  const toReturn: string[] = [formattedValue]
  
  if (currPosition === 'end') {
    toReturn.push(icon)
  } else {
    toReturn.unshift(icon)
  }
  
  return '<span class=\'ion-text-nowrap\'>' + toReturn.join(' ') + '</span>'
}
