import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'

// Reducers
//------------------------------------------------

const ActionTypes = {
  ACTIVATE:   'modal/activate',
  DEACTIVATE: 'modal/deactivate'
};

const modalReducer = (state = { active: false }, action) => {
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

// Components
//------------------------------------------------

class ModalFull extends React.Component {
  constructor(props) {
    super(props);
    this.onCloseClick = props.onCloseClick
  }

  componentDidMount() {
    document.body.classList.toggle('noscroll', this.props.active);
  }

  componentDidUpdate() {
    document.body.classList.toggle('noscroll', this.props.active);
  }

  componentWillUnmount() {
    document.body.classList.remove('noscroll');
  }

  render() {
    const modalClass = classNames(
      'modalFull',
      { 'modalFull_active': this.props.active, }
    );

    return (
      <div className={ modalClass }>
        <div className='modalFull__text'>
          <div>active: { `${this.props.active}` }</div>
        </div>
        <div className='modalFull__close' onClick={this.onCloseClick}>
          [x] close
        </div>
      </div>
    )
  }

  static get propTypes() {
    return {
      active: PropTypes.bool,
      onCloseClick: PropTypes.func.isRequired
    }
  }
}

const ModalFullContainer = function() {
  const mapStateToProps = state => {
    return {
      active: state.active
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onCloseClick: () => {
        dispatch({ type: ActionTypes.DEACTIVATE });
      }
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(ModalFull);
}();

const ModalActivator = props => {
  return (
    <div className='modalFull__open' onClick={props.onOpenClick}>
      [x] open
    </div>
  )
};

// Entry Point
//------------------------------------------------

export default function () {
  let store = createStore(modalReducer);

  const handleOpenClick = (e) => {
    store.dispatch({ type: ActionTypes.ACTIVATE });
  };

  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
      <Provider store={store}>
        <ModalFullContainer />
      </Provider>,
      document.body.appendChild(document.createElement('div'))
    );

    ReactDOM.render(
      <ModalActivator store={store} onOpenClick={handleOpenClick} />,
      document.getElementById('main')
    );
  });
};
