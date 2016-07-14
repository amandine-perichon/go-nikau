var express = require('express')
var app = express()
var path = require('path')
var fs = require('fs')
var svg2png = require('svg2png')

global.triangles = require('./images/background-0.js')
global.rainbow = require('./images/background-1.js')
global.zebra = require('./images/background-2.js')
var backgrounds = require('./images/backgrounds.js')

global.triangle = require('./images/shape-0.js')
global.rectangle = require('./images/shape-1.js')
var shapes = require('./images/shape.js')

app.use('/', express.static('public'))

app.get('/png/', function (req, res) {
  var svg = buildSVG(req.query.backgroundIndex,
                     req.query.shapeIndex,
                     req.query.inputText,
                     req.query.textColor)
  buildPNG(svg)
  res.sendFile(path.join(__dirname + '/dest.png'))
})

app.listen(8000, function () {
  console.log('Listening on port 8000!')
})

function buildSVG (backgroundIndex, shapeIndex, inputText, textColor) {
  var background = backgrounds[backgroundIndex].vector
  var shape = shapes[shapeIndex].vector
  var text = buildTextSVGTag(inputText, textColor)
  return "<svg width='800' height='600'>" + background + shape + text + "</svg>"
}

function buildPNG (svg) {
  svg2png(Buffer.from(svg), { width: 800, height: 600 })
    .then(buffer => fs.writeFileSync("dest.png", buffer))
    .catch(e => console.error(e))
}

function buildTextSVGTag (text, color) {
  return '<text x="50" y="150" font-size="5rem" font-family="Courier New" stroke="black" fill="' + color + '">' + text + '</text>'
}