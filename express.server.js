const express = require('express')
const app = express()
const port = 3001

const UserRoles = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  SERV_CLIENTI: 2,
  AGENTE: 3,
  CLIENTE: 4
}

app.all('*', (req, res, next) => {
  console.log(req.url)
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/auth/user', (req, res) => {
  res.json({
    user: {
      email: 'mario.rossi@gmail.com',
      firstName: 'Mario',
      lastName: 'Rossi',
      role: UserRoles.CLIENTE
    }
  })
})

app.post('/api/auth/login', (req, res) => {

  res.json({
    data: '87ad87a6s8d76as8d68asd687as6d867a'
  })
})

app.delete('/api/auth/logout', (req, res) => {
  res.send()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
