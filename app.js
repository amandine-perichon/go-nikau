var Cheer = React.createClass({
  propTypes: {
    backgroundIndex: React.PropTypes.number.isRequired,
    shapeIndex: React.PropTypes.number.isRequired
  },
  render: function () {
    var background = backgrounds[this.props.backgroundIndex].vector
    var shape = shapes[this.props.shapeIndex].vector
    var svg = "<svg width='800' height='600'>" + background + shape + "</svg>"
    function createMarkup() { return {__html: svg} }
    return <div className= "cheer" dangerouslySetInnerHTML={createMarkup()}></div>
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
  getInitialState: function() {
    return {value: 'Enter your text here'}
  },
  handleChange: function(event) {
    this.setState({value: event.target.value})
    this.props.onChange(this.state.value)
  },
  render: function() {
    return (
      <input
        type="text"
        value={this.state.value}
        onChange={this.handleChange}
      />
    )
  }
})

var App = React.createClass({
  getInitialState: function() {
    return {backgroundIndex: 0,
            shapeIndex: 0,
            inputText: ''
          }
  },
  render: function () {
    return (
      <div>
      <header>
        <span>GO NIKAU</span>
      </header>
      <Selector 
        choices={backgrounds} 
        currentIndex={this.state.backgroundIndex} 
        onChange={this.changeBackgoundIndex} />
      <Selector 
        choices={shapes} 
        currentIndex={this.state.shapeIndex} 
        onChange={this.changeShapeIndex} />
      <TextInput onChange={this.changeText} />
      <span>My text is {this.state.inputText}</span>
      <Cheer backgroundIndex={this.state.backgroundIndex} shapeIndex={this.state.shapeIndex} />
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
  }
})

function buildTextSVGTag (text, color) {
  return '<text x="0" y="15" fill="' + color + '">' + text + '</text>'
}

var app = <App />
ReactDOM.render(app, document.getElementById('app'))
