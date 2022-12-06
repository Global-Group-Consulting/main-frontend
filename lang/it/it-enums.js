export default {
  "AccountStatuses": {
    "draft": "Bozza",
    "draft_desc": "L'account è appena stato creato ma i dati potrebbero non essere ancora completi.",
    "created": "Da validare",
    "created_desc": "Il profilo deve essere validato e confermato dal Serv. Clienti.",
    "validated": "Attesa firma contratto",
    "validated_desc": "Profilo validato dal Serv. Clienti ed in attesa dellì'approvazione finale dell'amministrazione.",
    "incomplete": "Dati incompleti",
    "incomplete_desc": "I dati del profilo sono incompleti o non corretti.",
    "must_revalidate": "Da rivalidare",
    "must_revalidate_desc": "I dati sono stati aggiornati e devono essere confermati dal Serv. Clienti",
    "approved": "Attesa primo accesso",
    "approved_desc": "Account approvato dall'amministrazione ma non ancora attivato dall'utente.",
    "active": "Attivo",
    "active_desc": "Account attivato anche dall'utente quindi perfettamente funzionale.",
  },
  'UserRoles': {
    'superAdmin ': 'Super Admin',
    'admin': 'Amministrazione',
    'admin_plural': 'Amministrazione',
    'servClienti': 'Servizio clienti',
    'servClienti_plural': 'Servizio clienti',
    'agente': 'Agente',
    'agente_plural': 'Agenti',
    'cliente': 'Cliente',
    'cliente_plural': 'Clienti',
    'cliente-new': 'Cliente (da attivare)'
  },
  'Genders': {
    'm': 'Maschio',
    'f': 'Femmina'
  },
  'PersonTypes': {
    'fisica': 'Persona fisica',
    'giuridica': 'Persona giuridica'
  },
  'DocumentTypes': {
    'generico': 'Documento generico',
    'doc_identita': 'Carta d\'Identità',
    'patente': 'Patente di guida',
    'passaporto': 'Passaporto',
    'contabile': 'Contabile di pagamento'
  },
  'RequestTypes': {
    'admin': 'Admin',
    'versamento': 'Integrazione',
    'versamento_iniziale': 'Versamento iniziale',
    'risc_provvigioni': 'Riscossione provvigioni',
    'risc_capitale': 'Prelievo deposito',
    'risc_interessi': 'Riscossione rendite (classic)',
    'risc_interessi_brite': 'Riscossione rendite Gold',
    'risc_interessi_gold': 'Riscossione rendite Gold (Fisico)',
    'risc_manuale_interessi': 'Storno manuale rendite',
    'commission_manual_add': 'Aggiunta manuale provvigioni ad agente',
    'commission_manual_transfer': 'Trasferimento manuale provvigioni tra Agenti',
    "depositRepayment": "Rimborso",
  },
  'RequestStatus': {
    'nuova': "Da Evadere",
    'lavorazione': "In lavorazione",
    'accettata': "Accettata",
    'rifiutata': "Rifiutata",
    'annullata': "Annullata",
  },
  'WalletTypes': {
    'deposit': 'Deposito',
    'commision': 'Provvigioni',
  },
  'CurrencyType': {
    'euro': 'Euro',
    'brite': 'Brite',
    'gold': 'Gold'
  },
  'MovementTypes': {
    "initialDeposit": "Versamento iniziale",
    "depositAdded": "Integrazione",
    "interestRecapitalized": "Ricapitalizzazione mensile",
    "interestCollected": "Riscossione rendite",
    "depositCollected": "Prelievo deposito",
    "commissionCollected": "Riscossione provvigioni",
    "cancelInterestCollected": "Annullamento riscossione rendite",
    "cancelDepositCollected": "Annullamento prelievo deposito",
    "cancelCommissionCollected": "Annullamento riscossione provvigioni",
    "commissionsReinvestment": "Reinvestimento provvigioni",
    "commissionsCancellation": "Storno provvigioni",
    "cancelDepositAdded": "Annullamento versamento",
    "manualInterestCollected": "Storno rendite",
    "depositRepayment": "Rimborso",
  },
  "MessageTypes": {
    'newsletter': "Newsletter",
    'service': "Messaggio di servizio",
    'conversation': "Conversazione",
    'notification': "Notifica",
    'bug_report': "Segnalazione problema",
    'brite_use': "Utilizzo Brite",
  },
  "SignRequestEvents": {
    "convert_error": "Errore creazione documento",
    "converted": "Documento creato",
    "sending_error": "Errore invio documento",
    "sent": "Documento inviato",
    "declined": "L'utente si è rifiutato di firmare",
    "cancelled": "Documento annullato",
    "expired": "Documento scaduto",
    "signed": "Tutti i firmatari hanno firmato il documento",
    "signer_signed": "L'utente ha firmato il documento",
    "signer_email_bounced": "L'email dell'utente è in bounce",
    "signer_viewed_email": "L'utente ha visionato l'email",
    "signer_viewed": "L'utente ha visionato il documento",
    "signer_forwarded": "L'utente ha inoltrato il documento",
    "signer_downloaded": "L'utente ha scaricato il documento",
    "signrequest_received": "Richiesta di firma ricevuta"
  },
  "CommissionType": {
    "newDeposit": "Provvigione versamento",
    "totalDeposit": "Provvigione deposito mensile",
    "annualDeposit": "Provvigione deposito annuale",
    "manualAdd": "Aggiunta manuale",
    "manualTransfer": "Trasferimento da un altro agente",
    "manualTransferDoner": "Trasferimento verso agente",
    "repaymentTransfer": "Rimborso verso utente",
    "manualWithdrawal": "Rimozione manuale",
    "commissionsReinvestment": "Reinvestimento provvigioni",
    "commissionsCollected": "Riscossione provvigioni",
    "cancelCommissionsCollected": "Annullamento riscossione provvigioni",
    "commissionsToReinvest": "Chiusura mese e reinvestimento",
    "commissionsCancellation": "Storno provvigioni",
    "cancelCommissionsNewDeposit": "Storno per annullamento deposito cliente"
  },
  "NotificationTypes": {
    "user_validate": "Utente da validare",
    "user_validate_message": "Occorre validare i dati di {firstName} {lastName}.",
    "user_incomplete": "Dati utente incompleti",
    "user_incomplete_message": "I dati dell'utente {firstName} {lastName} sembra non siano validi.",
    "user_revalidate": "Utente da rivalidare",
    "user_revalidate_message": "Occorre rivalidare i dati di {firstName} {lastName} in quanto aggiornati dall'agente.",
    "user_sign_request": "Contratto da firmare",
    "user_sign_request_message": "E' necessario firmare il contratto di {firstName} {lastName}.",
    "user_approved": "L'account dell'utente {firstName} {lastName} è stato approvato!",
    "request_deposit": "Richiesta di versamento",
    "request_deposit_message": "{firstName} {lastName} desidera versare € {amount}",
    "request_deposit_collect": "Richiesta di riscossione deposito",
    "request_deposit_collect_message": "{firstName} {lastName} desidera prelevare € {amount} dal suo deposito.",
    "request_approved": "Richiesta approvata",
    "request_approved_message": "La tua richiesta è stata approvata!",
    "request_rejected": "Richiesta rifiutata",
    "request_rejected_message": "Purtroppo la tua richiesta è stata rifiutata!",
    "request_cancelled": "Richiesta annullata dall'utente",
    "request_cancelled_message": "{firstName} {lastName} ha annullato la sua richiesta.",
    "message_report": "Segnalazione Bug!!!",
    "message_report_message": "{senderName} ha segnalato un problema.",
    "message_chat": "Nuovo messaggio in chat",
    "message_chat_message": "Hai un nuovo messaggio in una chat.",
    "message_communication": "Nuova comunicazione",
    "message_communication_message": "Hai una nuova comunicazione.",
  },
  'PaymentMethods': {
    "bonifico": "Bonifico",
    "assegno": "Assegno",
    "altro": "Altro",
  },
  'ClubPacks': {
    "unsubscribed": "Non iscritto",
    "basic": "Basic",
    "fast": "Fast",
    "premium": "Premium",
  },
  'ClubMovementTypes': {
    "interest_recapitalized": "Ricapitalizzazione",
    "deposit_added": "Aggiunta",
    "deposit_removed": "Utilizzo",
    "deposit_transferred": "Trasferimento tra utenti",
    "deposit_collected": "Utilizzo brite",
  },
  'AgentTeamType': {
    "group_percentage": "Percentuale di gruppo",
    "subject_percentage": "Percentuale soggettiva"
  },
  'AgentBritesType': {
    "from_withdrawl": "Da risc. provvigioni",
    "manual_add": "Aggiunta",
    "manual_remove": "Utilizzo",
  }
}

