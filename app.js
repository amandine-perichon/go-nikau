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
    return <div className= "eight columns cheer" dangerouslySetInnerHTML={createMarkup()}></div>
  },
  buildSVG: function (backgroundIndex, shapeIndex, inputText, textColor) {
    var background = backgrounds[backgroundIndex].vector
    var shape = shapes[shapeIndex].vector
    var text = buildTextSVGTag(inputText, textColor)
    return "<svg width='800' height='600'>" + background + shape + text + "</svg>"
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
        <button onClick={this.previous}>Previous</button>
        <span>{this.props.choices[this.props.currentIndex].description}</span>
        <button onClick={this.next}>Next</button>
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
        placeholder="Write a cheer up message to your cohort!"
        rows="5"
        cols="40"
        maxLength="200"
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
    return {backgroundIndex: 0,
            shapeIndex: 0,
            inputText: 'Go Nikau!',
            textColor: 'rgb(0,0,0,1)',
            copied: false
          }
  },
  render: function () {
    return (
      <div>
        <header>
          <span>GO NIKAU</span>
        </header>
        <div className="row">
          <div className="four columns">
            <Selector 
              choices={backgrounds} 
              currentIndex={this.state.backgroundIndex} 
              onChange={this.changeBackgoundIndex} />
            <Selector 
              choices={shapes} 
              currentIndex={this.state.shapeIndex} 
              onChange={this.changeShapeIndex} />
            <div>Write a message and pick a color</div>
            <TextInput onChange={this.changeText} />
            <ColorInput onChange={this.changeColor}/>
            <CopyToClipboard 
              text={
                'http://localhost:8000/png' +
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

function buildTextSVGTag (text, color) {
  return '<text x="50" y="150" font-size="5rem" font-family="Courier New" stroke="black" fill="' + color + '">' + text + '</text>'
}

var app = <App />
ReactDOM.render(app, document.getElementById('app'))
