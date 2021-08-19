/**
 *  @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
export default {
  "user": {
    text: 'tables.reports.user',
    value: 'user',
    component: "CellUserName",
    sortable: false
  },
  "amountChange": {
    text: 'tables.reports.amount-change',
    value: 'amount',
    align: "right",
    component: "CellEuroValue",
    componentSettings: {
      showCurrency: true
    }
  },
  "movementType": {
    text: 'tables.reports.movement-type',
    value: '_id.requestType',
    component: "CellReportMovementType"
  },
  "clubPack": {
    text: 'tables.reports.club-pack',
    value: 'userClubPack',
    component: "CellUserClubPack",
    componentSettings: {
      item: "user",
      chipVersion: true
    }
  },
  "iban": {
    text: 'tables.reports.iban',
    value: 'user.contractIban',
    component: 'CellReportIban',
    sortable: false,
    componentSettings: {
      item: ""
    }
  },
  "notes": {
    text: 'tables.reports.notes',
    value: 'user.contractNotes',
    sortable: false,
    component: "CellReportNotes",
    width: "10%"
  },
  "reqNotes": {
    text: 'tables.reports.req-notes',
    value: 'reqNotes',
    sortable: false,
    component: "CellReportNotes",
    width: "10%"
  },
  "referenceAgent": {
    text: 'tables.reports.reference-agent',
    value: 'user.referenceAgent',
    component: "CellReportReferenceAgent",
    componentSettings: {
      item: ""
    }
  },
  "createdAt": {text: 'tables.reports.created-at', value: 'created_at', align: "center"},
  /*'actio1ns': {
    text: '',
    value: 'actions',
    sortable: false,
    align: 'center',
    width: '1%'
  }*/
}

/*
Mostrare:
- nome utente
- importo totale (se sono più richieste, mostrarne una unica)
- Tipo Richiesta
- Pacchetto club
- IBAN
- Note
- Note riscossione
- Agente riferimento
 */
