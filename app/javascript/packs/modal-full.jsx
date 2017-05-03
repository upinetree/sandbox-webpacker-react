import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class ModalStore {
  constructor(mediator) {
    this.state = { active: false };
    this.mediator = mediator;
  }

  activate() {
    this.state.active = true;
    this.mediator.notify(this.state);
  }

  deactivate()  {
    this.state.active = false;
    this.mediator.notify(this.state);
  }
}

class ModalMediator {
  constructor() {
    this.listeners = [];
  }

  register(listener) {
    this.listeners.push(listener);
  }

  notify(state) {
    // register でコールバックを登録するように実装するとさらに汎用的になる
    this.listeners.forEach(l => {
      l.setState({ active: state.active })
    })
  }
}

const modalMediator = new ModalMediator();
const modalStore = new ModalStore(modalMediator);

class ModalFull extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = { active: props.active }
  }

  componentDidMount() {
    modalMediator.register(this);
    document.body.classList.toggle('noscroll', this.state.active);
  }

  componentDidUpdate() {
    document.body.classList.toggle('noscroll', this.state.active);
  }

  componentWillUnmount() {
    document.body.classList.remove('noscroll');
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

  componentDidMount() {
    modalMediator.register(this);
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
  ReactDOM.render(
    <ModalFull store={modalStore} />,
    document.body.appendChild(document.createElement('div'))
  )

  ReactDOM.render(
    <ModalActivator store={modalStore} />,
    document.getElementById('main')
  )
});
