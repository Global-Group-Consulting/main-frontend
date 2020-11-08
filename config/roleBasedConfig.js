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
