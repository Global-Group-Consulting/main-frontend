const express = require('express')
const app = express()

const enforce = require('express-sslify')

if (process.env.NODE_ENV !== 'development') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

/*
app.all('*', (req, res, next) => {
  console.log(req.secure, req.protocol)

  if(!req.secure && req.protocol !== "https"){
    return res.redirect('https://' + req.headers.host + req.url);
  }

  next()
})
*/

module.exports = app
