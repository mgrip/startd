import React from 'react'
import { Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { actions as counterActions } from '../../reducers/counter'
import Button from '../patterns/button'

const Body = ({ add, counter }) => (
  <div onClick={add}>
    Hey clare. {counter}
    <Button text="test">Button</Button>
  </div>
)

const Homepage = connect(
  state => state,
  dispatch => {
    return {
      add: () => {
        dispatch(counterActions.add())
      },
      subtract: () => {
        dispatch(counterActions.subtract())
      }
    }
  }
)(Body)

const route = {
  path: '/',
  exact: true,
  component: Homepage
}
export { route as homepageRoute, Homepage }
