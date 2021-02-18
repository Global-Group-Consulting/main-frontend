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
    'title-withdrawal': 'Nuova richiesta di riscossione Classic',
    'title-withdrawal-gold': 'Nuova richiesta di riscossione Gold',
    'title-deposit': 'Versamento di nuova liquidità',
    'title-details': 'Dettagli richiesta',
    'tab-brite': 'Utilizza i tuoi Brite<br>e delega GlobalClub<br>alla vendita dell\'oro riservato',
    'tab-gold': 'Preleva l\'oro fisico',
    'btn-cancel': 'Annulla',
    'btn-close': 'Chiudi',
    'btn-send': 'Invia richiesta',
    'btn-send-club': 'Procedi con la richiesta',
    'btn-accept': 'Approva',
    'btn-reject': 'Rifiuta',
    'btn-delete': 'Elimina',
    'btn-go-to-conversation': 'Vai alla conversazione',
    'alert-reject-reason': "La richiesta è stata rifiutata per il seguente motivo:<br>",
    'alert-cancel-reason': "La richiesta è stata annullata in data {date} con il seguente motivo:<br>",
    'alert-connected-communication': "Alla richiesta è associata una comunicazione.",
    'alert-in-progress': "Questa richiesta è stata presa in carico da {firstName} {lastName}."
  },
  communicationDialog: {
    'you': "Me",
    'timeline-opposite': 'Inviato da <strong>{sender} </strong> il {timestamp}.',
    'timeline-opposite-dense': 'Inviato il {timestamp}.',
    'alert-connected-request-new-deposit': "Questa conversazione è collegata ad una richiesta di Versamento.",
    'receivers': "Destinatari",
    'btn-cancel': "Chiudi",
    'btn-go-to-request': "Vai alla richiesta",
    'btn-approve-request': "Approva richiesta",
    'btn-reject-request': "Rifiuta richiesta",
  },
  communicationNewDialog: {
    "title-conversation": "Nuovo ticket",
    "title-service": "Nuova comunicazione",
    "title-bug-report": "Segnalazione di un problema",
    "title-handle-new-deposit": "Comunicazione versamento nuovo deposito",
    "subject-new-deposit": "Comunicazione nuova richiesta di versamento - {date}",
    "message-new-deposit": "Gentile {firstName} {lastName},\nabbiamo ricevuto la sua richiesta di versamento.\nPer procedere, la invitiamo ad effettuare un bonifico della somma di €{amount} all'iban:\n[CODICE IBAN] \n\nSuccessivamente, la invitiamo a rispondere a questa comunicazione inviandoci la contabile del pagamento.\n\nCordiali saluti",
    "your-agent": "Il tuo agente",
    'btn-cancel': "Annulla",
    'btn-send': "Invia"
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
    'alert-no-contract': "Al momento, l'utente {firstName} {lastName} non ha ancora un contratto attivo. Nel caso in cui l'utente abbia sottoscritto un contratto cartaceo, è possibile importarlo, scegliendo il file pdf e premendo su 'Importa contratto'.",
    'alert-import-data': "Tuttavia, è possibile importare la lista dei movimenti precedenti da un file \".csv\". Per procedere, sceglire il file da importare e premere sul pulsante 'Importa lista'.",
    'alert-import-success': "L'operazione di importazione è andata a buon fine. La invitiamo a controllare l'esattezza dei dati importati.",
    'alert-import-contract-success': "Contratto importato correttamente. Questo sarà visibile nella sezione relativa al contratto.",
    'file-placeholder': "Scegli un file...",
    'btn-cancel': 'Chiudi',
    'btn-import': 'Importa lista',
    'btn-import-contract': 'Importa contratto',
  },
  changelog: {
    title: "Dettaglio degli Aggiornamenti"
  },
  clientsList: {
    'title': 'Elenco clienti dell\'agente',
    'btn-cancel': "Chiudi",
    'btn-open-user': "Apri"
  },
  aclEditDialog: {
    titleRoles: "Modifica Ruoli",
    titlePermissions: "Modifica Permessi",
    titleDirectPermissions: "Modifica Permessi Diretti",
    titleDescription: "Modifica Descrizione",
    cancelText: "Annulla",
    saveText: "Salva",
    addText: "Aggiungi...",
    select: {
      label: {
        roles: "",
        permissions: "",
        directPermissions: ""
      },
      selection: "{count} selezionati"
    }
  },
  addAclDialog: {
    titleRoles: "Aggiungi Ruolo",
    titlePermissions: "Aggiungi Permesso",
    "btn-cancel": "Annulla",
    "btn-save": "Salva e Crea"
  }
}
