import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dispatcher } from 'flux';
import { ReduceStore, Container } from 'flux/utils';

const dispatcher = new Dispatcher();

const ActionTypes = {
  ACTIVATE:   'modal/activate',
  DEACTIVATE: 'modal/deactivate'
};

const Actions = {
  activate() {
    dispatcher.dispatch({
      type: ActionTypes.ACTIVATE
    });
  },

  deactivate() {
    dispatcher.dispatch({
      type: ActionTypes.DEACTIVATE
    });
  }
}

class ModalStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return { active: false };
  }

  reduce(state, action) {
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
}
const modalStore = new ModalStore();

class ModalFull extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: props.active }
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
          <div className='modalFull__close' onClick={Actions.deactivate}>
            [x] close
          </div>
        </div>
      </div>
    )
  }

  static getStores() {
    return [modalStore];
  }

  static calculateState() {
    return modalStore.getState();
  }

  static get defaultProps() {
    return { active: false }
  }

  static get propTypes() {
    return { active: PropTypes.bool }
  }
}
const ModalContainer = Container.create(ModalFull);

class ModalActivator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='modalFull__open' onClick={Actions.activate}>
        [x] open
      </div>
    )
  }
}

export default function () {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
      <ModalContainer />,
      document.body.appendChild(document.createElement('div'))
    );

    ReactDOM.render(
      <ModalActivator />,
      document.getElementById('main')
    );
  });
};
