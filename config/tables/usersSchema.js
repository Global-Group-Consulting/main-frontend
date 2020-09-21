export default function (context) {
  return {
    headers: [
      { text: 'ID', value: 'contractNumber' },
      { text: 'Nome', value: 'firstName' },
      { text: 'Cognome', value: 'lastName' },
      { text: 'Email', value: 'email' },
      { text: 'Regione', value: 'businessRegion' },
      {
        text: '',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '1%'
      }
    ]
  }
}
