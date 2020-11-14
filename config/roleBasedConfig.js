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
        'amount',
        'currency',
        'type',
        'created_at',
        ['updated_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova"]]
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
        ['updated_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova"]]
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
        ['updated_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova"]]
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
        ['updated_at', ["accettata", "rifiutata"]],
        ['actions', ["nuova"]]
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
