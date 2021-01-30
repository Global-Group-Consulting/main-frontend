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
    conversations: {
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
      ]
    },
    calculatorMovements: {
      columns: [
        'date',
        'movementType',
        'amount',
        'actions',
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
        ['contractStatus', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'accountStatus',
        'actions'
      ]
    },

    requests: {
      columns: [
        'contractNumber',
        'user',
        'amount',
        'currency',
        'type',
        'created_at',
        ['updated_at', ["lavorazione"]],
        ['completed_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova"]]
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
    movements: {
      columns: [
        "amountChange",
        "movementType",
        "createdAt",
        "deposit",
        "interestAmount"
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
        ['contractStatus', [UserRoles.AGENTE, UserRoles.CLIENTE]],
        'accountStatus',
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
        "interestAmount"
      ]
    },
    conversations: {
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
        'accountStatus',
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
        "interestAmount"
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
