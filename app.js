var Cheer = React.createClass({
  propTypes: {
    backgroundIndex: React.PropTypes.number.isRequired
  },
  render: function () {
    return <img className= "cheer" src={"./images/background-" + this.props.backgroundIndex + ".svg"} />
  }
})

var App = React.createClass({
  getInitialState: function() {
    return {backgroundIndex: 1}
  },
  render: function () {
    return  <div>
            <header>
              <span>GO NIKAU</span>
            </header>
            <button onClick= {this.previousBackground}>Previous background</button>
            <span>{backgrounds[this.state.backgroundIndex].description}</span>
            <button onClick= {this.nextBackground}>Next background</button>
            <Cheer backgroundIndex={this.state.backgroundIndex} />
            </div>
  },
  previousBackground: function () {
    this.setState({backgroundIndex: previous(this.state.backgroundIndex)})
  },
  nextBackground: function () {
    this.setState({backgroundIndex: next(this.state.backgroundIndex)})
  }
})

var app = <App />
ReactDOM.render(app, document.getElementById('app'))

function previous (index) {
  var max = Object.keys(backgrounds).length
  return index !== 1? index - 1 : max
}

function next (index) {
  var max = Object.keys(backgrounds).length
  return index !== max? index + 1 : 1
}
