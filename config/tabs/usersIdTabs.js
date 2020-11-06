export default function (formContext) {
  return [
    {
      title: 'user-data',
      cardTitle: 'user-data',
      schema: "basicData"
    },
    {
      title: `user-${formContext.userIsPersonaGiuridica ? 'legal-' : ''}residence`,
      cardTitle: `user-${formContext.userIsPersonaGiuridica ? 'legal-' : ''}residence`,
      schema: "addressData"
    },
    {
      title: 'contacts',
      cardTitle: 'contacts',
      schema: "contactsData"
    },
    {
      title: 'contract',
      cardTitle: 'contract',
      schema: "contractData"
    },
    {
      title: 'other',
      cardTitle: 'other',
      schema: "extraData"
    }
  ]
}
