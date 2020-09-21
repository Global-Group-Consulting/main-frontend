export default function (context) {
  return {
    headers: [
      { text: context.$t('tables.contract-number'), value: 'contractNumber' },
      { text: context.$t('tables.first-name'), value: 'firstName' },
      { text: context.$t('tables.last-name'), value: 'lastName' },
      { text: context.$t('tables.email'), value: 'email' },
      { text: context.$t('tables.reference-agent'), value: 'referenceAgent' },
      {
        text: context.$t('tables.action'),
        value: 'actions',
        sortable: false,
        align: 'center',
        visible: false,
        width: '1%'
      }
    ]
  }
}
