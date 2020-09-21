import { basicData, addressData, contactsData, contractData, extraData } from '@/config/forms/usersDataSchema'

export default function (context) {
  return [
    {
      title: 'user-data',
      cardTitle: 'user-data',
      schema: basicData(context)
    },
    {
      title: `user-${context.personaGiuridica ? 'legal-' : ''}residence`,
      cardTitle: `user-${context.personaGiuridica ? 'legal-' : ''}residence`,
      schema: addressData(context)
    },
    {
      title: 'contacts',
      cardTitle: 'contacts',
      schema: contactsData(context)
    },
    {
      title: 'contract',
      cardTitle: 'contract',
      schema: contractData(context)
    },
    {
      title: 'other',
      cardTitle: 'other',
      schema: extraData(context)
    }
  ]
}
