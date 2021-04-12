const express = require('express')
const app = express()

app.all('*', (req, res, next) => {
  console.log(req.secure, req.protocol)

  if(!req.secure && req.protocol !== "https"){
    return res.redirect('https://' + req.headers.host + req.url);
  }

  next()
})

module.exports = app
