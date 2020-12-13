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
    }
  }
}

const admin = {
  tables: {
    users: {
      columns: [
        'superAdmin',
        'firstName',
        'lastName',
        'email',
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



export { admin, servClienti, agente, cliente }

export default {
  defaults,
  admin,
  servClienti,
  agente,
  cliente,
}
