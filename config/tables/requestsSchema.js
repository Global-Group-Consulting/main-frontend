export default function (context) {
  const userRole = context.$auth.user.role

  const adminHeaders = [
    { text: context.$t('tables.contract-number'), value: 'contractNumber' },
    { text: context.$t('tables.first-name'), value: 'firstName' },
    { text: context.$t('tables.last-name'), value: 'lastName' },
    { text: context.$t('tables.email'), value: 'email' },
    { text: context.$t('tables.request-type'), value: 'requestType' },
    { text: context.$t('tables.request-amount'), value: 'requestAmount' },
    {
      text: '',
      value: 'actions',
      sortable: false,
      align: 'center',
      width: '1%'
    }
  ]

  const userHeaders = [
    { text: context.$t('tables.request-amount'), value: 'requestAmount' },
    { text: context.$t('tables.request-type'), value: 'requestType' },
    { text: context.$t('tables.data_update'), value: 'data_update' },
  ]

  if ([context.$enums.UserRoles['ADMIN'], context.$enums.UserRoles['SERV_CLIENTI']]
    .includes(userRole)) {
    return { headers: adminHeaders }
  }

  return { headers: userHeaders }
}
