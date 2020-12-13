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
    'versamento': 'Versamento',
    'risc_provvigioni': 'Riscossione provvigioni',
    'risc_capitale': 'Prelievo deposito',
    'risc_interessi': 'Riscossione rendite (classic)',
  },
  'WalletTypes': {
    'deposit': 'Deposito',
    'commision': 'Provvigioni',
  },
  'CurrencyType': {
    'euro': 'Euro',
    'brite': 'Brite'
  },
  'MovementTypes': {
    "initialDeposit": "Versamento iniziale",
    "depositAdded": "Nuovo Versamento",
    "interestRecapitalized": "Ricapitalizzazione mensile",
    "interestCollected": "Riscossione interessi",
    "depositCollected": "Riscossione capitale",
    "commissionCollected": "Riscossione provvigioni",
    "cancelInterestCollected": "Annullamento riscossione interessi",
    "cancelDepositCollected": "Annullamento riscossione capitale",
    "cancelCommissionCollected": "Annullamento riscossione provvigioni",
    "commissionsReinvestment": "Reinvestimento provvigioni",
  },
  "MessageTypes": {
    'newsletter': "Newsletter",
    'service': "Messaggio di servizio",
    'conversation': "Conversazione",
    'notification': "Notifica",
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
    "commissionsReinvestment": "Reinvestimento provvigioni",
    "commissionsCollected": "Riscossione provvigioni",
    "cancelCommissionsCollected": "Annullamento riscossione provvigioni",
    "commissionsToReinvest": "Chiusura mese e reinvestimento"
  }
}
