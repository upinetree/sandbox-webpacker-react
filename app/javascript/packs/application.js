import modalFullMediator from 'packs/modal-full-mediator'
import modalFullObserver from 'packs/modal-full-observer'

const routes = {
  'modal_full#observer': modalFullObserver,
  'modal_full#mediator': modalFullMediator,
  'default': new Function()
}

const dispatched = routeName in routes ? routes[routeName] : routes['default'];
dispatched();
