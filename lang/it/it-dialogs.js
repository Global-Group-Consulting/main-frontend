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
    'title-withdrawal-3': 'Nuova richiesta di prelievo deposit Classic',
    'title-withdrawal-4': 'Nuova richiesta di riscossione rendite Classic',
    'title-withdrawal-5': 'Nuova richiesta di riscossione provvigioni',
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
    'btn-chat': 'Prendi in carico',
    'btn-reject': 'Rifiuta',
    'btn-delete': 'Elimina',
    'btn-cancel-auto-withdrawl': 'Annulla richiesta automatica',
    'btn-go-to-conversation': 'Vai alla conversazione',
    'alert-reject-reason': "La richiesta è stata rifiutata per il seguente motivo:<br>",
    'alert-cancel-reason': "La richiesta è stata annullata in data {date} con il seguente motivo:<br>",
    'alert-connected-communication': "Alla richiesta è associata una comunicazione.",
    'alert-in-progress': "Questa richiesta è stata presa in carico da <strong>{firstName} {lastName}</strong>.",
    'alert-auto-withdrawl': "Questa è una richiesta che verrà gestita automaticamente dal sistema in quanto prevede la riscossione automatica di tutte le provvigioni disponibili l'ultimo giorno del mese.",
    'alert-auto-withdrawl-recursive': "Questa è una richiesta ricorrente che verrà gestita automaticamente dal sistema in quanto prevede la riscossione automatica mensile delle provvigioni disponibili l'ultimo giorno di ogni mese.",
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
    "message-new-deposit": "Gentile {firstName} {lastName},\nla sua richiesta è stata presa in carico.",
    "subject-new-withdrawl": "Comunicazione nuova richiesta di prelievo deposito - {date}",
    "message-new-withdrawl": "Gentile {firstName} {lastName},\n",
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
    'alert-no-data': "",
    'alert-no-contract': "Al momento, l'utente {firstName} {lastName} non ha ancora un contratto attivo. Nel caso in cui l'utente abbia sottoscritto un contratto cartaceo, è possibile importarlo, scegliendo il file pdf e premendo su 'Importa contratto'.",
    'alert-import-data': "E' possibile importare la lista dei movimenti precedenti dell'utente <strong>{firstName} {lastName}</strong> da un file \".csv\". Per procedere, scegliere il file da importare e premere sul pulsante 'Importa lista'.",
    'alert-import-success': "L'operazione di importazione è andata a buon fine. La invitiamo a controllare l'esattezza dei dati importati.",
    'alert-import-contract-success': "Contratto importato correttamente. Questo sarà visibile nella sezione relativa al contratto.",
    'alert-overwrite-movements': "L'utente ha già dei movimenti presenti. Continuando l'importazione i movimenti precedenti verranno eliminati e ricreati in base al file importato.<br>Siete sicuri di voler continuare?<br><strong>L'operazione non sarà reversibile!</strong>",
    'file-placeholder': "Scegli un file...",
    'btn-cancel': 'Chiudi',
    'btn-import': 'Importa lista',
    'btn-overwrite': 'Si, sovrascrivi',
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
  },
  briteAddDialog: {
    title: "Aggiungi Brite",
    "btn-cancel": "Annulla",
    "btn-save": "Aggiungi"
  },
  briteUseDialog: {
    title: "Richiesta utilizzo brite",
    "btn-send": "Invia richiesta",
    "btn-cancel": "Annulla"
  },
  briteRemoveDialog: {
    title: "Rimuovi brite",
    "btn-send": "Rimuovi",
    "btn-cancel": "Annulla"
  },
  calculatorMovementsDialog: {
    titleDepositCollected: "Riscossione deposito",
    titleDepositAdded: "Versamento nuova liquidità",
    titleInterestCollected: "Riscossione interessi"
  },
  commissionsAddDialog: {
    title: "Aggiunta manuale provvigioni",
    "btn-send": "Aggiungi",
    "btn-cancel": "Annulla"
  },
  contractTermsCondition: {
    title: "Termini e condizioni",
    "btn-cancel": "Chiudi"
  },
  adminRequestDialog: {
    "title": "Nuova richiesta di <strong>{request}</strong>",
    "alert-msg": "Questa funzione permette di creare delle richieste per conto dell'utente <strong>{fullName}</strong>. Assicurarsi che quest'ultimo abbia dato il consenso a tale operazione, prima di procedere.<br>La richiesta che verrà creata sarà immediatamente approvata e contabilizzata.",
    "btn-cancel": "Annulla",
    "btn-send": "Invia"
  }
}
