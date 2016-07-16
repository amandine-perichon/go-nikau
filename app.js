var Cheer = React.createClass({
  propTypes: {
    backgroundIndex: React.PropTypes.number.isRequired,
    shapeIndex: React.PropTypes.number.isRequired,
    inputText: React.PropTypes.string.isRequired,
    textColor: React.PropTypes.string.isRequired,
  },
  render: function () {
    var svg = this.buildSVG(this.props.backgroundIndex,
              this.props.shapeIndex,
              this.props.inputText,
              this.props.textColor)
    function createMarkup() { return {__html: svg} }
    return <svg width='800' height='600' className= "eight columns cheer" dangerouslySetInnerHTML={createMarkup()}></svg>
  },
  buildSVG: function (backgroundIndex, shapeIndex, inputText, textColor) {
    var background = backgrounds[backgroundIndex].vector
    var shape = shapes[shapeIndex].vector
    var text = buildTextSVG(inputText, textColor)
    return "<g>" + background + shape + text + "</g>"
  }
})

var Selector = React.createClass({
  propTypes: {
    choices: React.PropTypes.array.isRequired,
    currentIndex: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
  },
  render : function () {
    return (
      <div>
        <img className="arrow" src="./images/arrow-left.svg" onClick={this.previous} />
        <div className="choice">{this.props.choices[this.props.currentIndex].description}</div>
        <img className="arrow" src="./images/arrow-right.svg" onClick={this.next}/>
      </div>
    )
  },
  previous: function () {
    var max = this.props.choices.length
    var index = this.props.currentIndex !== 0? this.props.currentIndex - 1 : max - 1
    this.props.onChange(index)
  },
  next: function () {
    var max = this.props.choices.length
    var index = this.props.currentIndex !== max - 1? this.props.currentIndex + 1 : 0
    this.props.onChange(index)
  }
})

var TextInput = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  handleChange: function(event) {
    this.props.onChange(event.target.value)
  },
  render: function() {
    return (
      <textarea
        type="text"
        placeholder="Write a cheer message to your cohort!"
        maxLength="140"
        onChange={this.handleChange}
      ></textarea>
    )
  }
})

var ColorInput = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
    return {color : 'rgb(0,0,0,1)'}
  },
  render: function () {
    return (
      <ColorPicker color={this.state.color} 
      onChange={this.handleChange} 
      opacitySlider />
    )
  },
  handleChange : function(color) {
    this.setState({ color : color })
    this.props.onChange(color)
  }
})

var App = React.createClass({
  getInitialState: function() {
    return {backgroundIndex: Math.floor(Math.random() * backgrounds.length),
            shapeIndex: Math.floor(Math.random() * shapes.length),
            textColor: 'rgb(0,0,0,1)',  
            inputText: 'Write a cheer message to your cohort!',
            copied: false
          }
  },
  render: function () {
    return (
      <div>
        <header>
          <span className="title">GO NIKAU</span>
          <span>Cheer your cohort</span>
        </header>
        <div className="row">
          <div className="four columns editor">
            <div className="helper">Choose a background</div>
            <Selector 
              choices={backgrounds} 
              currentIndex={this.state.backgroundIndex} 
              onChange={this.changeBackgoundIndex} />
            <Selector 
              choices={shapes} 
              currentIndex={this.state.shapeIndex} 
              onChange={this.changeShapeIndex} />
            <div className="helper">Write a message and pick a color</div>
            <TextInput onChange={this.changeText} />
            <ColorInput onChange={this.changeColor}/>
            <CopyToClipboard 
              text={
                'https://go-nikau.herokuapp.com/png' +
                '?backgroundIndex=' + this.state.backgroundIndex +
                '&shapeIndex=' + this.state.shapeIndex +
                '&inputText=' + encodeURI(this.state.inputText) +
                '&textColor=' + encodeURI(this.state.textColor)
                }
              onCopy={() => {this.setState({copied: true})}}>
              <button>Copy to clipboard</button>
            </CopyToClipboard>
          </div>
          <Cheer
            backgroundIndex={this.state.backgroundIndex}
            shapeIndex={this.state.shapeIndex}
            inputText={this.state.inputText}
            textColor={this.state.textColor}
            onChange={this.changeImage} />
        </div>
        <footer>
        </footer>
      </div>
    )
  },
  changeBackgoundIndex: function (index) {
    this.setState({backgroundIndex: index})
  },
  changeShapeIndex: function (index) {
    this.setState({shapeIndex: index})
  },
  changeText: function (text) {
    this.setState({inputText: text})
  },
  changeColor: function (color) {
    this.setState({textColor: color})
  }
})

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
  return '<text x="' + x + ' " y="' + y + '" font-size="5rem" font-family="Permanent Marker" stroke="black" fill="' + color + '">' + text + '</text>'
}

var app = <App />
ReactDOM.render(app, document.getElementById('app'))
