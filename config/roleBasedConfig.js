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
    }
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
    }
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "depositCollected",
        "interestsCollected",
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
    }
  },
  blocks: {
    dashboard: {
      blocks: [
        "deposit",
        "interestAmount",
        "depositCollected",
        "interestsCollected",
      ]
    }
  }
}



export { admin, servClienti, agente, cliente }

export default {
  admin,
  servClienti,
  agente,
  cliente,
}
