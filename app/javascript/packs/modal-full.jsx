import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class ModalStore {
  constructor(observer) {
    this.state = { active: false };
    this.observer = observer;
  }

  activate() {
    this.state.active = true;
    this.observer.notify(this.state);
  }

  deactivate()  {
    this.state.active = false;
    this.observer.notify(this.state);
  }
}

class ModalObserver {
  constructor() {
    this.listeners = [];
  }

  register(listeners) {
    this.listeners = listeners;
  }

  notify(state) {
    this.listeners.forEach(l => {
      l.setState({ active: state.active })
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

  componentDidMount() {
    document.body.classList.toggle('noscroll', this.state.active);
  }

  componentDidUpdate() {
    document.body.classList.toggle('noscroll', this.state.active);
  }

  componentWillUnmount() {
    document.body.classList.remove('noscroll');
  }

  handleClose(e) {
    this.props.store.deactivate();
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
    this.props.store.activate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const observer = new ModalObserver();
  const modalStore = new ModalStore(observer);

  const modal = ReactDOM.render(
    <ModalFull store={modalStore} />,
    document.body.appendChild(document.createElement('div'))
  )

  const activator = ReactDOM.render(
    <ModalActivator store={modalStore} />,
    document.getElementById('react-root')
  )

  observer.register([modal, activator]);
});
