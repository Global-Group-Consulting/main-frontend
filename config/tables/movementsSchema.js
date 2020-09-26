export default function (context) {

  const headers = [
    { text: 'Importo', value: 'requestAmount' },
    { text: 'Tipo', value: 'type' },
    { text: 'Data richiesta', value: 'requestDate' },
    { text: 'Data lavorazione', value: 'data_update' },
  ]

  return { headers }
}
