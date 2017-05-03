import modalFullMediator from 'packs/modal-full-mediator'

const routes = {
  'modal_full#mediator': modalFullMediator,
  'default': new Function()
}

const dispatched = routeName in routes ? routes[routeName] : routes['default'];
dispatched();
