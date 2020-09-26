import { reactive } from '@vue/composition-api'

export default function () {
  const tableHeaders = reactive([
    { text: 'Oggetto', value: 'subject' },
    { text: 'Mittente', value: 'sender' },
    { text: 'Destinatario', value: 'user' },
    { text: 'Data inizio', value: 'creation_timestamp' },
    { text: 'Data ultimo mess.', value: 'last_message_timestamp' },
    { text: 'Messaggi', value: 'messages' },
  ])

  return tableHeaders
}
