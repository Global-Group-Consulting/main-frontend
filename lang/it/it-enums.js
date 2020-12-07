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
    'servClienti': 'Servizio clienti',
    'agente': 'Agente',
    'cliente': 'Cliente',
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
    'interessi': 'Riscossione provvigioni',
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
  },
  "MessageTypes": {
    'newsletter': "Newsletter",
    'service': "Messaggio di servizio",
    'conversation': "Conversazione",
    'notification': "Notifica",
  }
}
