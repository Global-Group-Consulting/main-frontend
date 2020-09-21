export default function (context) {
  return {
    headers: [
      { text: context.$t('tables.contract-number'), value: 'contractNumber' },
      { text: context.$t('tables.first-name'), value: 'firstName' },
      { text: context.$t('tables.last-name'), value: 'lastName' },
      { text: context.$t('tables.email'), value: 'email' },
      { text: context.$t('tables.request-type'), value: 'requestType' },
      { text: context.$t('tables.request-amount'), value: 'requestAmount' },
      {
        text: context.$t('tables.action'),
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '1%'
      }
    ]
  }
}
