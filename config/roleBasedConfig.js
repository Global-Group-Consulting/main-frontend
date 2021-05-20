import UserRoles from "../enums/UserRoles"

const defaults = {
  forms: {
    users: {
      tabs: []
    }
  },
  tables: {
    users: {
      columns: [
        'contractNumber',
        'firstName',
        'lastName',
        'email',
        'accountStatus',
        'clubPack',
        'commissionsAssigned',
        'actions'
      ]
    },
    clients: {
      columns: [
        'contractNumber',
        'firstName',
        'lastName',
        'email',
        'role',
        'clientsNumber',
        'referenceAgent',
        'actions'
      ]
    },
    usersFilter: {
      columns: [
        'contractNumber',
        'firstName',
        'lastName',
        'email',
        'referenceAgent',
        'contractStatus',
        'role',
        'accountStatus',
        'clubPack',
        'actions'
      ]
    },
    movements: {
      columns: [
        "amountChange",
        "movementType",
        "createdAt",
        "deposit",
        "interestAmount"
      ]
    },
    messages: {
      columns: [
        "subject",
        "type",
        "createdAt",
      ]
    },
    messagesSent: {
      columns: [
        "subject",
        "type",
        "receiver",
        "createdAt",
      ]
    },
    commissions: {
      columns: [
        "amountChange",
        "commissionType",
        "commissionPercentage",
        "user",
        "createdAt",
        "currMonthCommissions"
      ]
    },

    conversations: {
      columns: [
        "subject",
        "createdAt",
        "creator",
        "updatedAt",
        "unreadMessages",
      ]
    },
    clubConversations: {
      columns: [
        "subject",
        "createdAt",
        "creator",
        "updatedAt",
        "unreadMessages",
      ]
    },
    calculator: {
      columns: [
        "date",
        "depositAdded",
        "depositCurrent",
        "interestAmount",
        "interestRecapitalized",
        "interestCollected",
        "depositCollected",
        "brite",
        "britePartial",
      ]
    },
    calculatorMovements: {
      columns: [
        'date',
        'movementType',
        'amount',
        'actions',
      ]
    },
    aclUsers: {
      columns: [
        'firstName',
        'lastName',
        'email',
        'roles',
        'permissions',
      ]
    },
    aclRoles: {
      columns: [
        'code',
        'description',
        'permissions',
        'actions',
      ]
    },
    aclPermissions: {
      columns: [
        'code',
        'description',
        'actions',
      ]
    },
    club: {
      columns: [
        'clubCardNumber',
        'firstName',
        'lastName',
        'email',
        'clubPack',
        // 'role',
        'briteTotal',
        'briteUsed',
        'briteAvailable',
        'actions'
      ]
    },
    brite: {
      columns: [
        'amountChange',
        'createdAt',
        'semesterId',
        'movementType',
        'deposit',
        'depositOld',
        'notes',
      ]
    },
    requests: {
      columns: [
        'amount',
        'user',
        'referenceAgent',
        'type',
        'created_at',
        ['updated_at', ["lavorazione"]],
        ['completed_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova", "accettata"]]
      ]
    },
    requestsDashboard: {
      columns: [
        'amount',
        'user',
        'referenceAgent',
        'type',
        'status',
        'created_at',
        ['updated_at', ["lavorazione"]],
      ]
    },
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "interestsCollected",
        "depositCollected",
      ]
    },
    users: {
      blocks: [
        "active",
        "pendingFirstAccess",
        "pendingSignature",
        "draft",
      ]
    }
  }
}

const admin = {
  tables: {
    users: {
      columns: [
        ['superAdmin', [UserRoles.ADMIN]],
        ['contractNumber', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'firstName',
        'lastName',
        'email',
        ['referenceAgent', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        ['commissionsAssigned', [UserRoles.AGENTE]],
        ['clientsNumber', [UserRoles.AGENTE]],
        ['contractStatus', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'accountStatus',
        'clubPack',
        'actions',
      ]
    },

    pendingUsers: {
      columns: [
        "contractNumber",
        "firstName",
        "lastName",
        "email",
        "validatedAt"
      ]
    },
    pendingSignatures: {
      columns: [
        "contractNumber",
        "firstName",
        "lastName",
        "email",
        'signDocSent',
        'signDocViewed',
        'signDocSigned',
        'signDocLogs',
        'actions',
      ]
    },
    movements: {
      columns: [
        "amountChange",
        "movementType",
        "createdAt",
        "deposit",
        "interestAmount"
      ]
    }
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "interestsCollected",
        "depositCollected",
      ]
    },
    wallet: {
      blocks: [
        "monthCommissions",
        "reinvestedCommissions",
        "collectedCommissions",
        "clientsTotalDeposit",
      ]
    }
  }
}

const servClienti = {
  tables: {
    users: {
      columns: [
        ['contractNumber', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'firstName',
        'lastName',
        'email',
        ['referenceAgent', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        ['commissionsAssigned', [UserRoles.AGENTE]],
        ['clientsNumber', [UserRoles.AGENTE]],
        ['contractStatus', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'accountStatus',
        'clubPack',
        'actions'
      ]
    },
    requests: {
      columns: [
        'amount',
        'currency',
        'type',
        'created_at',
        ['updated_at', ["lavorazione"]],
        ['completed_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova"]]
      ]
    },
    movements: {
      columns: [
        "amountChange",
        "movementType",
        "createdAt",
        "deposit",
        "interestAmount"
      ]
    },
    usersToValidate: {
      columns: [
        "contractNumber",
        "firstName",
        "lastName",
        "email",
      ]
    },
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "interestsCollected",
        "depositCollected",
      ]
    },
    wallet: {
      blocks: [
        "monthCommissions",
        "reinvestedCommissions",
        "collectedCommissions",
        "clientsTotalDeposit",
      ]
    }
  }
}

const cliente = {
  tables: {
    requests: {
      columns: [
        'amount',
        'currency',
        'type',
        'created_at',
        ['updated_at', ["lavorazione"]],
        ['completed_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova", "accettata"]]
      ]
    },
    movements: {
      columns: [
        "amountChange",
        "movementType",
        "createdAt",
        "deposit",
        "interestAmount",
        "actions"
      ]
    },
    conversations: {
      columns: [
        "subject",
        "createdAt",
        "updatedAt",
        "unreadMessages",
      ]
    },
    clubConversations: {
      columns: [
        "subject",
        "createdAt",
        "updatedAt",
        "unreadMessages",
      ]
    }
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "interestsCollected",
        "depositCollected",
      ]
    }
  }
}

const agente = {
  tables: {
    users: {
      columns: [
        'contractNumber',
        'firstName',
        'lastName',
        'email',
        ['referenceAgent', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        ['clientsNumber', [UserRoles.AGENTE]],
        ['commissionsAssigned', [UserRoles.AGENTE]],
        ['contractStatus', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'accountStatus',
        'clubPack',
        'actions'
      ]
    },
    requests: {
      columns: [
        'amount',
        'currency',
        'type',
        'created_at',
        ['updated_at', ["lavorazione"]],
        ['completed_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova", "accettata"]]
      ]
    },
    movements: {
      columns: [
        "amountChange",
        "movementType",
        "createdAt",
        "deposit",
        "interestAmount",
        "actions"
      ]
    },
    commissions: {
      columns: [
        "amountChange",
        "commissionType",
        "commissionPercentage",
        "user",
        "createdAt",
        "currMonthCommissions"
      ]
    }
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "interestsCollected",
        "depositCollected",
      ]
    },
    wallet: {
      blocks: [
        "monthCommissions",
        "reinvestedCommissions",
        "collectedCommissions",
        "clientsTotalDeposit",
      ]
    }
  }
}


export {admin, servClienti, agente, cliente}

export default {
  defaults,
  admin,
  servClienti,
  agente,
  cliente,
}
