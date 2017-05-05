Rails.application.routes.draw do
  controller 'modal_full_test' do
    get 'modal_full/mediator'
    get 'modal_full/observer'
    get 'modal_full/event'
    get 'modal_full/flux'
    get 'modal_full/simple_redux'
    get 'modal_full/redux'
  end
end
