export default {
  default: {
    cancelBtn: "Annulla",
    confirmBtn: "Applica"
  },
  userMessage: {
    'title': 'Comunica con l\'utente',
    'btn-cancel': 'Annulla',
    'btn-send': 'Invia',
  },
  requests: {
    'title-withdrawal': 'Nuova richiesta di riscossione',
    'title-deposit': 'Versamento di nuova liquidità',
    'title-details': 'Dettagli richiesta',
    'btn-cancel': 'Annulla',
    'btn-close': 'Chiudi',
    'btn-send': 'Invia richiesta',
    'btn-accept': 'Approva',
    'btn-reject': 'Rifiuta',
    'btn-delete': 'Elimina',
    'alert-reject-reason': "La richiesta è stata rifiutata per il seguente motivo:<br>",
    'alert-cancel-reason': "La richiesta è stata annullata in data {date} con il seguente motivo:<br>"
  },
  comunicationDialog: {
    'timeline-opposite': 'Inviato da <strong>{firstName} {lastName}</strong> il {timestamp}.',
    'timeline-opposite-dense': 'Inviato il {timestamp}.'
  },
  filePreviewer: {
    'title': '',
    'btn-cancel': 'Chiudi',
    'btn-download': 'Scarica',
  },
  statusChange: {
    'title': 'Modifica stato account ({status})',
    'alert': "Attenzione!\nCambiare lo stato manualmente è molto pericoloso e può causare malfunzionamenti e corruzione dei dati. Procedete con molta cautela e solo se estremamente necessario!",
    'btn-cancel': 'Annulla',
    'btn-confirm': 'Applica',
  },
  movementsList: {
    'title': 'Elenco dei movimenti',
    'alert-no-data': "Al momento, l'utente {firstName} {lastName} non ha ancora alcun movimento.",
    'alert-import-data': "Tuttavia, è possibile importare la lista dei movimenti precedenti da un file \".csv\". Per procedere, sceglire il file da importare e premere sul pulsante 'Importa lista'.",
    'alert-import-success': "L'operazione di importazione è andata a buon fine. La invitiamo a controllare l'esattezza dei dati importati.",
    'file-placeholder': "Scegli un file...",
    'btn-cancel': 'Chiudi',
    'btn-import': 'Importa lista',
  }
}
