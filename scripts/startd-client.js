import React from 'react'
import { render } from 'react-dom'
import App from '../src/App.js'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import { reducer as counterReducer } from '../src/reducers/counter'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combineReducers({
    counter: counterReducer
  }),
  composeEnhancers()
)

document.addEventListener('DOMContentLoaded', event => {
  render(
    <Provider store={store}>
      <BrowserRouter><App /></BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )
})
