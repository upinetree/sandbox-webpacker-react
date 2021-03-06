import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Observable
class ModalStore {
  constructor() {
    this.state = { active: false };
    this.observers = [];
  }

  activate() {
    this.state.active = true;
    this.notify(this.state);
  }

  deactivate()  {
    this.state.active = false;
    this.notify(this.state);
  }

  registerObserver(observer) {
    this.observers.push(observer);
  }

  notify(state) {
    // register でコールバックを登録するように実装すると依存が減らせる
    this.observers.forEach(o => {
      o.setState({ active: state.active });
    })
  }
}

class ModalFull extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = { active: props.active }
  }

  componentDidMount() {
    this.props.store.registerObserver(this);
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
      <div className={ modalClass }>
        <div className='modalFull__close' onClick={this.handleClose}>
          [x] close
        </div>
        <div className='modalFull__text'>
          <div>active: { `${this.state.active}` }</div>
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

const ModalActivator = (props) => {
  const handleOpen = (e) => {
    props.store.activate();
  }

  return (
    <div className='modalFull__open' onClick={handleOpen}>
      [x] open
    </div>
  )
};

export default function () {
  document.addEventListener('DOMContentLoaded', () => {
    const modalStore = new ModalStore();

    ReactDOM.render(
      <ModalFull store={modalStore} />,
      document.body.appendChild(document.createElement('div'))
    );

    ReactDOM.render(
      <ModalActivator store={modalStore} />,
      document.getElementById('main')
    );
  });
};
