export default {
  dashboard: {
    title: 'La mia dashboard',
    deposit: "Deposito",
    interests: "Rendite",
    depositAdd: "Versa",
    depositCollect: "Preleva Deposito",
    depositCollected: "Deposito Prelevato",
    movementsList: "Lista movimenti",
    interestsCollect: "Riscuoti Rendite",
    interestsCollected: "Rendite Riscosse"
  },
  login: {
    'title': 'Accedi all\'area personale',
    'log-in': 'Accedi',
    'forgot-password': 'Password dimenticata?',
  },
  forgot: {
    'title': 'Recupera la tua password',
    'back-to-login': 'Torna alla login',
    'recover-password': 'Recupera password',
    'recover-sent': 'Gentile utente, abbiamo provveduto ad inviare una email con le istruzioni per il recupero della password all\'indirizzo indicato.'
  },
  recover: {
    'title': 'Imposta la nuova password',
    'back-to-login': 'Torna alla login',
    'recover-password': 'Imposta password',
    'recover-success': 'Gentile utente, abbiamo provveduto ad aggiornare la sua password. Ora verrà reindirizzato automaticamente alla sua dashboard.'
  },
  movements: {
    'title': "Lista movimenti"
  },
  activate: {
    'title': 'Attiva il tuo account',
    'recover-password': 'Imposta password',
    'recover-success': 'Gentile utente, abbiamo provveduto ad attivare il suo account ed aggiornare la sua password. Ora verrà reindirizzato automaticamente alla sua dashboard.'
  },
  activationWizard: {
    'user-info': `Gentile utente,
        per completare l'attivazione del suo account, e necesario completare i seguenti passi.`,
    'phase-user-data': 'Dati anagrafici',
    'phase-attachments': 'Allegati',
    'phase-contract-sign': 'Firma contratto',
    'contract-sign-otp-alert': `Per firmare il contratto, le verrà inviata una email contenente un codice che poi dovrà
                                inserire nella casella sottostante. Una volta fatto questo, il contratto sarà firmato.`,
    'btn-next': 'Avanti',
    'btn-back': 'Indietro',
    'btn-sign-confirm': 'Firma e Conferma',
    'btn-send-otp': 'Invia codice OTP',
  },
  users: {
    'title': 'Elenco degli utenti',
    'subtitle': '',
    'btn-add-user': 'Aggiungi utente',
    'btn-filter-data': 'Filtra i dati',
    "draft": "Bozza",
    "pendingSignature": "Attesa firma contratto",
    "pendingFirstAccess": "Attesa primo accesso",
    "active": "Attivi",
  },
  usersId: {
    'title': 'Anagrafica',
    'title-new-user': 'Anagrafica',
    'title-new-with-role': 'Nuovo {role}',
    'subtitle': 'Stato utente: <strong>{accountState}</strong>',
    'subtitle-new-user': 'Creazione di un nuovo utente',
    'subtitle-new-user-with-role': 'Creazione di un nuovo utente con ruolo <strong>"${role}"</strong>',
    'info-incomplete-data': "Questo account è stato segnalato come contenente dati non validi.",
    'info-incomplete-data-message': "Messaggio:",
    'info-incomplete-data-fields': "Campi non validi:",
    'info-incomplete-single-field': "Questo campo è stato segnalato come non valido",
    'info-sign-logs-title': "Dettaglio eventi firma",
    'no-contract-available': "Documento non ancora disponibile",
    'btn-go-back-tooltip': 'Torna all\'elenco degli utenti',
    'btn-send-activation-email': 'Invia email di attivazione',
    'btn-send-activation-email-tooltip': 'Invia email di attivazione',
    'btn-reset-password': 'Resetta password',
    'btn-reset-password-tooltip': 'Resetta password',
    'btn-send-email': 'Invia comunicazione',
    'btn-send-email-tooltip': 'Invia comunicazione',
    'btn-next': 'Avanti',
    'btn-save': 'Salva modifiche',
    'btn-previous': 'Indietro',
    'btn-approve': 'Attiva account',
    'btn-approve-tooltip': 'Attiva l\'account dell\'utente.',
    'btn-confirm-draft-user': 'Confermare account',
    'btn-confirm-draft-user-tooltip': 'Conferma account e invia il contratto da firmare.',
    'btn-confirm-draft-user-admin': 'Attiva account',
    'btn-confirm-draft-user-tooltip-admin': 'Attiva l\'account dell\'utente.',
    'btn-validate-user': "Convalida account",
    'btn-validate-user-tooltip': "Convalida l'account e quindi invia il contratto da firmare.",
    'btn-incomplete-user': "Segnala dati",
    'btn-incomplete-user-tooltip': "Segnala all'agente di riferimento i dati non corretti.",
    'btn-movements-list': "Movimenti e Contratto",
    'btn-resend-contract': "Ricrea contratto",
    'btn-resend-contract-tooltip': "Annulla contratto pendente e ne crea uno nuovo.",

    tabs: {
      'user-data': 'Dati Utente',
      'user-residence': 'Residenza',
      'user-legal-residence': 'Sede legale / Residenza',
      'contacts': 'Contatti',
      'contract': 'Contratto',
      'agent': 'Impostazioni Agente',
      'club': 'Gold / Global Club',
      'other': 'Ruolo / Varie'
    }

  },
  user: {
    profile: {
      title: "Profilo utente"
    }
  },
  communications: {
    title: 'Chat e comunicazioni',
    subtitle: '',
    tickets: "Chat",
    communications: "Comunicazioni",
    messagesSent: "Comunicazioni Inviate",
    clubConversations: "Global Club",
    me: "Me",
    "btn-new-conversation": "Nuova chat",
    "btn-new-message": "Nuova comunicazione"
  },
  requests: {
    title: "Elenco delle richieste",
    subtitle: '',
    "btnWithdrawal": "Risc. Classic",
    "btnWithdrawalGold": "Risc. Gold",
    "btnWithdrawalDepositGold": "Prel. Deposito",
    "btnWithdrawal-tooltip": "Crea una richiesta di Riscossione Classic",
    "btnWithdrawalGold-tooltip": "Crea una richiesta di Riscossione Gold",
    "btnWithdrawalDepositGold-tooltip": "Crea una richiesta di Prelievo Deposito",
    "btnDeposit": "Versamento",
    "btnDeposit-tooltip": "Versa nuova liquidità",
    "btnDownloadReport": "Scarica Report",
    'tableNuova-title': "Da evadere",
    'tableLavorazione-title': "In lavorazione",
    'tableAccettata-title': "Accettate",
    'tableRifiutata-title': "Rifiutate",
    "fileReportName": "Report {date}",
    "autoWithdrawlAll-tooltip": "Riscossione di tutto l'importo disponibile alla fine del mese in corso",
    "autoWithdrawlAllRecursive-tooltip": "Riscossione ricorrente di tutto l'importo disponibile alla fine di ogni mese"
  },
  signResult: {
    "success-title": "Contratto firmato!",
    "success-message": "Grazie per aver completato la procedura di attivazione del suo contratto.<br>A breve riceverà un email con le informazioni per accedere la prima volta alla sua area personale.<br><br>Con l'occasione le diamo il benvenuto in Global Group Consulting!",

    "reject-title": "Contratto rifiutato!",
    "reject-message": "Ci dispiace che abbia rifiutato di firmare il contratto. Se pensa ci sia stato qualche tipo di errore, la invitiamo a contattare il nostro servizio clienti.<br><br>Cordiali saluti,<br>Global Group Consulting"
  },
  wallet: {
    title: "Wallet provvigioni",
    subtitle: "",
    monthCommissions: "Provvigioni guadagnate",
    reinvestedCommissions: "Provvigioni reinvestite",
    collectedCommissions: "Provvigioni riscosse",
    clientsTotalDeposit: "Versamenti dei clienti nell'anno in corso",
    collectCommissions: "Preleva",
    agentBritesTotal: "Brite Accumulati",
    agentBritesCurrMonth: "Brite Mese corrente",
    addCommissions: "Aggiungi / Trasferisci",
    addBrites: "Aggiungi / Rimuovi",
    useBrites: "Utilizza",
    tabs: {
      commissions: "Provvigioni",
      agentBrites: "Brite",
    }
  },
  calculator: {
    title: "Preventivi"
  },
  acl: {
    title: "Ruoli e permessi"
  },
  club: {
    title: "Global Club",

    brite: {
      title: "Movimenti Brite",
      activePack: "Pacchetto attivo: <strong>{pack}</strong>",
      changeActivePack: "Cambia il pacchetto attivo",
      totalUsableBrite: "Totale brite utilizzabili",
      totalExpiresAt: "<strong>{amount}</strong> scadono il {expiresAt}",

      tabs: {
        archive: "Archivio",
        briteTotal: "Totale Brite accumulati",
        briteUsed: "Brite Utilizzati",
        briteAvailable: "Brite Disponibili",
        usableFrom: "<strong>Utilizzabili dal</strong> {date}",
        expiresAt: "<strong>Scadenza</strong> {date}",
        movements: "Elenco movimenti",
        use: "Utilizza",
        addBrite: "Aggiungi",
        removeBrite: "Rimuovi",
      },
    },
    packUnsubscribed: "Non iscritti",
    packBasic: "Basic",
    packFast: "Fast",
    packPremium: "Premium",
  },
  settings: {
    title: "Impostazioni",
    globalSettings: "Configurazioni globali",
    cardSettings: "Riscossioni e Card prepagate"
  },
  magazine: {
    title: "Magazine Global News"
  },
  reports: {
    title: "Report uscite"
  }
}
