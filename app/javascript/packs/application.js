import modalFullMediator from 'packs/modal_full/mediator'
import modalFullObserver from 'packs/modal_full/observer'
import modalFullEvent    from 'packs/modal_full/event'
import modalFullFlux     from 'packs/modal_full/flux'
import modalFullRedux    from 'packs/modal_full/redux'

const routes = {
  'modal_full#observer': modalFullObserver,
  'modal_full#mediator': modalFullMediator,
  'modal_full#event':    modalFullEvent,
  'modal_full#flux':     modalFullFlux,
  'modal_full#redux':    modalFullRedux,
  'default': new Function()
}

const dispatched = routeName in routes ? routes[routeName] : routes['default'];
dispatched();
