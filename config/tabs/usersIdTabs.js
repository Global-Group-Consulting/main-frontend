import { basicData, addressData, contactsData, contractData, extraData } from '@/config/forms/usersDataSchema'

export default function (formContext) {
  return [
    {
      title: 'user-data',
      cardTitle: 'user-data',
      schema: basicData(formContext)
    },
    {
      title: `user-${formContext.userIsPersonaGiuridica ? 'legal-' : ''}residence`,
      cardTitle: `user-${formContext.userIsPersonaGiuridica ? 'legal-' : ''}residence`,
      schema: addressData(formContext)
    },
    {
      title: 'contacts',
      cardTitle: 'contacts',
      schema: contactsData(formContext)
    },
    {
      title: 'contract',
      cardTitle: 'contract',
      schema: contractData(formContext)
    },
    {
      title: 'other',
      cardTitle: 'other',
      schema: extraData(formContext)
    }
  ]
}
