const express = require('express')
const app = express()
const port = 3001

const UserRoles = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  SERV_CLIENTI: 2,
  AGENTE: 3,
  CLIENTE: 4,
}

const user = {
  email: '',
  firstName: 'Mario',
  lastName: 'Rossi',
  role: 4,
  activatedAt: null,
  contractNumber: '000123'
}

app.use(express.json())

app.all('*', (req, res, next) => {
  console.log(req.url)
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/auth/user', (req, res) => {
  res.json({
    user
  })
})

app.post('/api/auth/login', (req, res) => {
  const incomingData = req.body
  const activatedAt = +incomingData.role === 5 ? null : '2020-06-20 10:15:00'

  let role = +incomingData.role

  if (role === 5) {
    role = 4
  }

  Object.assign(user, {
    email: incomingData.email,
    role,
    activatedAt
  })

  res.json({
    data: '87ad87a6s8d76as8d68asd687as6d867a',
  })
})

app.delete('/api/auth/logout', (req, res) => {
  res.send()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
