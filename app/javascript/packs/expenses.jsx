import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class ModalObserver {
  constructor() {
    this.state = { active: false };
    this.listeners = [];
  }

  activate() {
    this.state.active = true;
    this.notify();
  }

  deactivate()  {
    this.state.active = false;
    this.notify();
  }

  register(listeners) {
    this.listeners = listeners;
  }

  notify() {
    this.listeners.forEach(l => {
      l.setState({ active: this.state.active })
    })
  }
}

class ModalFull extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = { active: props.active }
  }

  render() {
    const modalClass = classNames(
      'modalFull',
      { 'modalFull_active': this.state.active, }
    );

    return (
      <div>
        <div className={ modalClass }>
          <div className='modalFull__text'>
            <div>active: { `${this.state.active}` }</div>
          </div>
          <div className='modalFull__close' onClick={this.handleClose}>
            [x] close
          </div>
        </div>
      </div>
    )
  }

  handleClose(e) {
    this.props.observer.deactivate();
  }

  static get defaultProps() {
    return { active: false }
  }

  static get propTypes() {
    return { active: PropTypes.bool }
  }
}

class ModalActivator extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
  }

  render() {
    return (
      <div className='modalFull__open' onClick={this.handleOpen}>
        [x] open
      </div>
    )
  }

  handleOpen(e) {
    this.props.observer.activate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const observer = new ModalObserver();

  const modal = ReactDOM.render(
    <ModalFull observer={observer} />,
    document.getElementById('react-modal-root')
  )

  const activator = ReactDOM.render(
    <ModalActivator observer={observer} />,
    document.getElementById('react-root')
  )

  observer.register([modal, activator]);
});
