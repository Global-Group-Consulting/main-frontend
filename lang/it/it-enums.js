export default {
  "AccountStatuses": {
    "draft": "Bozza",
    "draft_desc": "L'account è appena stato creato ma i dati potrebbero non essere ancora completi.",
    "pending_signature": "Attesa firma",
    "pending_signature_desc": "E' necessario che l'utente apponga la firma digitalmente.",
    "pending_confirm": "Attesa conferma",
    "pending_confirm_desc": "L'utente ha apposto la firma e l'agente deve confermare la completezza di tutti i dati.",
    "created": "Creato",
    "created_desc": "Il profilo deve essere confermato dal Serv. Clienti.",
    "validated": "Validato",
    "validated_desc": "Profilo validato dal Serv. Clienti ed in attesa dellì'approvazione finale dell'amministrazione.",
    "incomplete": "Dati incompleti",
    "incomplete_desc": "I dati del profilo sono incompleti o non corretti.",
    "must_revalidate": "Validazione richiesta",
    "must_revalidate_desc": "I dati sono stati aggiornati e devono errere confermati dal Serv. Clienti",
    "approved": "Approvato",
    "approved_desc": "Account approvato dall'amministrazione ma non ancora attivato dall'utente.",
    "active": "Attivo",
    "active_desc": "Account attivato anche dall'untete quindi perfettamente funzionale.",
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
    'interessi': 'Reinvestimento provvigioni',
    'risc_capitale': 'Prelievo deposito',
    'risc_interessi': 'Riscossione rendite',
  },
  'WalletTypes': {
    'deposit': 'Deposito',
    'commision': 'Provvigioni',
  },
  'CurrencyType': {
    'euro': 'Euro',
    'brite': 'Brite'
  }
}
