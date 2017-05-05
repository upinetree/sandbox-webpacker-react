import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStore } from 'redux'

const ActionTypes = {
  ACTIVATE:   'modal/activate',
  DEACTIVATE: 'modal/deactivate'
};

function modalReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ACTIVATE:
      return Object.assign({}, state, {
        active: true
      });
    case ActionTypes.DEACTIVATE:
      return Object.assign({}, state, {
        active: false
      });
    default:
      return state;
  }
}

let store = createStore(modalReducer);

class ModalFull extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = { active: props.active }
  }

  componentDidMount() {
    const self = this;
    this.props.store.subscribe(() => {
      self.setState(self.props.store.getState());
    });
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
    this.props.store.dispatch({ type: ActionTypes.DEACTIVATE });
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
    this.props.store.dispatch({ type: ActionTypes.ACTIVATE });
  }
}

export default function () {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
      <ModalFull store={store} />,
      document.body.appendChild(document.createElement('div'))
    );

    ReactDOM.render(
      <ModalActivator store={store} />,
      document.getElementById('main')
    );
  });
};
