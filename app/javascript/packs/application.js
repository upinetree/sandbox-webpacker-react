import modalFullMediator from 'packs/modal_full/mediator'
import modalFullObserver from 'packs/modal_full/observer'
import modalFullEvent    from 'packs/modal_full/event'

const routes = {
  'modal_full#observer': modalFullObserver,
  'modal_full#mediator': modalFullMediator,
  'modal_full#event':    modalFullEvent,
  'default': new Function()
}

const dispatched = routeName in routes ? routes[routeName] : routes['default'];
dispatched();
