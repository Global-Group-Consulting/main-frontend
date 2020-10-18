const defaults = {
  forms: {
    users: {
      tabs: []
    }
  }
}

const admin = {
  tables: {
    users: {
      columns: [
        'contractNumber',
        'firstName',
        'lastName',
        'email',
        'actions'
      ]
    }
  }
}

export { admin }

export default {
  admin
}
