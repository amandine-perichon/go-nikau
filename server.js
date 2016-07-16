var express = require('express')
var app = express()
var path = require('path')
var fs = require("pn/fs");
var svg2png = require('svg2png')

global.pinkSparkle = require('./images/background-0.js')
global.abstractOrange = require('./images/background-1.js')
global.purpleFiesta = require('./images/background-2.js')
global.cloudyDay = require('./images/background-2.js')
var backgrounds = require('./images/backgrounds.js')

global.octopus = require('./images/shape-0.js')
global.rainbow = require('./images/shape-1.js')
global.kiwi = require('./images/shape-1.js')
global.unicorn = require('./images/shape-1.js')
global.dragon = require('./images/shape-1.js')
var shapes = require('./images/shape.js')

app.use('/', express.static('public'))

app.get('/png/', function (req, res) {
  var svgText = "<svg width='800' height='600'>" + buildSVG(req.query.backgroundIndex,
                     req.query.shapeIndex,
                     req.query.inputText,
                     req.query.textColor) + "</svg>"
  svgText = svgText.replace(/inkscape:(export-|connector-curvature)[^"]+"[^"]+"/g, "")
  buildPNG(svgText)
  res.sendFile(path.join(__dirname + '/dest.png'))
})

var port = process.env.PORT || 8000
app.listen(port, function () {
  console.log('Listening on port ' + port +' !')
})

function buildSVG (backgroundIndex, shapeIndex, inputText, textColor) {
  var background = backgrounds[backgroundIndex].vector
  var shape = shapes[shapeIndex].vector
  var text = buildTextSVG(inputText, textColor)
  return "<g> " + background + shape + text + " </g>"
}

function buildPNG (svg) {
  fs.writeFile('source.svg', svg)
    .then(() => fs.readFile("source.svg"))
    .then(svg2png)
    .then(buffer => fs.writeFile("dest.png", buffer))
    .catch(e => console.error(e))
}

function buildTextSVG(text, color) {
  var wordsArray = text.split(' ')
  var lineArray = []
  var line = ''
  wordsArray.forEach(function (elem, i) {
    if (i === wordsArray.length - 1) {
      line = line + ' ' + elem
      lineArray.push(line)
    }
    else if (line.length + elem.length >= 27) {
      lineArray.push(line)
      line = elem
    } else {
      line = line + ' ' + elem
    }
  })
  return lineArray.reduce(function (total, elem, i) {
    return total + buildTextSVGTag(elem, color, 50 , (330 + 45 * i))
  }, '')
}

function buildTextSVGTag (text, color, x, y) {
  return '<text x="' + x + ' " y="' + y + '" font-size="5rem" font-family="Arial" stroke="black" fill="' + color + '">' + text + '</text>'
}