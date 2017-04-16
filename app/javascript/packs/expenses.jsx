import React from 'react'
import ReactDOM from 'react-dom'

class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.name}!</div>
  }

  static get defaultProps() {
    return {
      name: 'David'
    }
  }

  static get propTypes() {
    return {
      name: React.PropTypes.string
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <div>
      <Hello name="React" />
      <Hello />
    </div>,
    document.body.appendChild(document.createElement('div')),
  )
});