import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ModalStore {
  constructor() {
    this.state = { active: false };
  }

  activate() {
    this.state.active = true;
  }

  deactivate()  {
    this.state.active = false;
  }
}

class ModalMediator {
  constructor(store) {
    this.stores = [store]; // 複数あって、多対多のちょっと複雑な環境を想定
    this.listeners = [];
  }

  activate() {
    this.stores.forEach(s => { s.activate(); });
    this.notify({ active: true });
  }

  deactivate() {
    this.stores.forEach(s => { s.deactivate(); });
    this.notify({ active: false });
  }

  register(listener) {
    this.listeners.push(listener);
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

  componentDidMount() {
    this.props.mediator.register(this);
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
    this.props.mediator.deactivate();
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
    props.mediator.activate();
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
    const modalMediator = new ModalMediator(modalStore);

    ReactDOM.render(
      <ModalFull mediator={modalMediator} />,
      document.body.appendChild(document.createElement('div'))
    )

    ReactDOM.render(
      <ModalActivator mediator={modalMediator} />,
      document.getElementById('main')
    )
  });
};
