export function moneyFormatter(value: string | number | null | undefined,
                               formatBrite = false,
                               returnEmptyIfZero = false): string {

  if (value === undefined || value === null || value === "" || Number.isNaN(value)) {
    value = 0
  }

  if (typeof value === "string") {
    // remove all non numeric values
    let test = value.replace(/[^.,0-9]/g, "");

    const dots = test.match(".");
    const commas = test.match(",");

    // se contiene . e anche , tratto la , come decimale ed elimino il .
    if (dots && commas) {
      test = test.replace(/\./g, "");
      test = test.replace(/,/g, ".");
    } else

      // se contiene solo . lo tratto come decimale in quanto se converto un numero toString() è quello che ottengo
    if (dots && dots.length === 1 && !commas) {
      // nothing must be done
    } else

      // se contiene solo , lo tratto come decimale
    if (commas && commas.length === 1 && !dots) {
      test = test.replace(/,/g, ".")
    } else

      // se contiene più . li tratto come divisori di migliaia
    if (dots && dots.length > 1 && !commas) {
      test = test.replace(/\./g, "")
    } else

      // se contiene più , le tratto come divisori di migliaia
    if (commas && commas.length > 1 && !dots) {
      test = test.replace(/,/g, "")
    }

    value = +test
  }

  const formatter = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: !formatBrite ? 2 : 0,
    maximumFractionDigits: !formatBrite ? 2 : 0,
    useGrouping: true,
  })

  const formattedValue = formatter.format(value)

  if (returnEmptyIfZero && (!value || formattedValue === "0,00")) {
    return ""
  }

  return formattedValue
}
