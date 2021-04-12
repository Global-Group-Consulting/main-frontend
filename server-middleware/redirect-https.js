const express = require('express')
const app = express()

app.all('*', (req, res, next) => {
  if(!req.secure){
    return res.redirect('https://' + req.headers.host + req.url);
  }

  next()
})

module.exports = app
