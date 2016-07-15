'use strict';

var Cheer = React.createClass({
  displayName: 'Cheer',

  propTypes: {
    backgroundIndex: React.PropTypes.number.isRequired,
    shapeIndex: React.PropTypes.number.isRequired,
    inputText: React.PropTypes.string.isRequired,
    textColor: React.PropTypes.string.isRequired
  },
  render: function render() {
    var svg = this.buildSVG(this.props.backgroundIndex, this.props.shapeIndex, this.props.inputText, this.props.textColor);
    function createMarkup() {
      return { __html: svg };
    }
    return React.createElement('svg', { width: '800', height: '600', className: 'nine columns cheer', dangerouslySetInnerHTML: createMarkup() });
  },
  buildSVG: function buildSVG(backgroundIndex, shapeIndex, inputText, textColor) {
    var background = backgrounds[backgroundIndex].vector;
    var shape = shapes[shapeIndex].vector;
    var text = buildTextSVG(inputText, textColor);
    return "<g>" + background + shape + text + "</g>";
  }
});

var Selector = React.createClass({
  displayName: 'Selector',

  propTypes: {
    choices: React.PropTypes.array.isRequired,
    currentIndex: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement('img', { className: 'arrow', src: './images/arrow-left.svg', onClick: this.previous }),
      React.createElement(
        'div',
        { className: 'choice' },
        this.props.choices[this.props.currentIndex].description
      ),
      React.createElement('img', { className: 'arrow', src: './images/arrow-right.svg', onClick: this.next })
    );
  },
  previous: function previous() {
    var max = this.props.choices.length;
    var index = this.props.currentIndex !== 0 ? this.props.currentIndex - 1 : max - 1;
    this.props.onChange(index);
  },
  next: function next() {
    var max = this.props.choices.length;
    var index = this.props.currentIndex !== max - 1 ? this.props.currentIndex + 1 : 0;
    this.props.onChange(index);
  }
});

var TextInput = React.createClass({
  displayName: 'TextInput',

  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  handleChange: function handleChange(event) {
    this.props.onChange(event.target.value);
  },
  render: function render() {
    return React.createElement('textarea', {
      type: 'text',
      placeholder: 'Write a cheer message to your cohort!',
      maxLength: '140',
      onChange: this.handleChange
    });
  }
});

var ColorInput = React.createClass({
  displayName: 'ColorInput',

  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return { color: 'rgb(0,0,0,1)' };
  },
  render: function render() {
    return React.createElement(ColorPicker, { color: this.state.color,
      onChange: this.handleChange,
      opacitySlider: true });
  },
  handleChange: function handleChange(color) {
    this.setState({ color: color });
    this.props.onChange(color);
  }
});

var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return { backgroundIndex: 0,
      shapeIndex: 0,
      inputText: 'Write a cheer message to your cohort!',
      textColor: 'rgb(0,0,0,1)',
      copied: false
    };
  },
  render: function render() {
    var _this = this;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        null,
        React.createElement(
          'span',
          { className: 'title' },
          'GO NIKAU'
        ),
        React.createElement(
          'span',
          null,
          'Cheer your cohort'
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'three columns editor' },
          React.createElement(
            'div',
            { className: 'helper' },
            'Choose a background'
          ),
          React.createElement(Selector, {
            choices: backgrounds,
            currentIndex: this.state.backgroundIndex,
            onChange: this.changeBackgoundIndex }),
          React.createElement(Selector, {
            choices: shapes,
            currentIndex: this.state.shapeIndex,
            onChange: this.changeShapeIndex }),
          React.createElement(
            'div',
            { className: 'helper' },
            'Write a message and pick a color'
          ),
          React.createElement(TextInput, { onChange: this.changeText }),
          React.createElement(ColorInput, { onChange: this.changeColor }),
          React.createElement(
            CopyToClipboard,
            {
              text: 'http://localhost:8000/png' + '?backgroundIndex=' + this.state.backgroundIndex + '&shapeIndex=' + this.state.shapeIndex + '&inputText=' + encodeURI(this.state.inputText) + '&textColor=' + encodeURI(this.state.textColor),
              onCopy: function onCopy() {
                _this.setState({ copied: true });
              } },
            React.createElement(
              'button',
              null,
              'Copy to clipboard'
            )
          )
        ),
        React.createElement(Cheer, {
          backgroundIndex: this.state.backgroundIndex,
          shapeIndex: this.state.shapeIndex,
          inputText: this.state.inputText,
          textColor: this.state.textColor,
          onChange: this.changeImage })
      ),
      React.createElement('footer', null)
    );
  },
  changeBackgoundIndex: function changeBackgoundIndex(index) {
    this.setState({ backgroundIndex: index });
  },
  changeShapeIndex: function changeShapeIndex(index) {
    this.setState({ shapeIndex: index });
  },
  changeText: function changeText(text) {
    this.setState({ inputText: text });
  },
  changeColor: function changeColor(color) {
    this.setState({ textColor: color });
  }
});

function buildTextSVG(text, color) {
  var wordsArray = text.split(' ');
  console.log(wordsArray);
  var lineArray = [];
  var line = '';
  wordsArray.forEach(function (elem, i) {
    console.log(line);
    if (i === wordsArray.length - 1) {
      line = line + ' ' + elem;
      lineArray.push(line);
    } else if (line.length + elem.length >= 28) {
      lineArray.push(line);
      line = elem;
    } else {
      line = line + ' ' + elem;
    }
  });
  return lineArray.reduce(function (total, elem, i) {
    return total + buildTextSVGTag(elem, color, 50, 330 + 45 * i);
  }, '');
}

function buildTextSVGTag(text, color, x, y) {
  return '<text x="' + x + ' " y="' + y + '" font-size="5rem" font-family="Permanent Marker" stroke="black" fill="' + color + '">' + text + '</text>';
}

var app = React.createElement(App, null);
ReactDOM.render(app, document.getElementById('app'));
