var express = require('express')
var app = express()
var path = require('path')

app.use('/', express.static('public'))

app.get('/png/', function(req, res) {
  console.log(req.query)
  res.sendFile(path.join(__dirname + '/banana.png'))
})

app.listen(8000, function () {
  console.log('Listening on port 8000!')
})