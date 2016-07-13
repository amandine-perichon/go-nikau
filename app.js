var Cheer = React.createClass({
  propTypes: {
    backgroundIndex: React.PropTypes.number.isRequired,
    shapeIndex: React.PropTypes.number.isRequired,
    inputText: React.PropTypes.string.isRequired
  },
  render: function () {
    var background = backgrounds[this.props.backgroundIndex].vector
    var shape = shapes[this.props.shapeIndex].vector
    var text = buildTextSVGTag(this.props.inputText, "red") 
    var svg = "<svg width='800' height='600'>" + background + shape + text + "</svg>"
    function createMarkup() { return {__html: svg} }
    return <div className= "eight columns cheer" dangerouslySetInnerHTML={createMarkup()}></div>
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
        maxlength="200"
        onChange={this.handleChange}
      ></textarea>
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
            <TextInput onChange={this.changeText} />
            <button onClick={() => console.log("Copy to clipboard")}>Copy to clipboard
            </button>
            <button onClick={() => console.log("Share on Slack")}>Share on Slack
            </button>
          </div>
          <Cheer  backgroundIndex={this.state.backgroundIndex}
                  shapeIndex={this.state.shapeIndex}
                  inputText={this.state.inputText} />
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
  }
})

function buildTextSVGTag (text, color) {
  return '<text x="0" y="15" fill="' + color + '">' + text + '</text>'
}

var app = <App />
ReactDOM.render(app, document.getElementById('app'))
