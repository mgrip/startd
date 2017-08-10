import React from 'react'
import { Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { actions as counterActions } from '../../reducers/counter'
import Button from '../patterns/button'
import Theme from './theme'
import Patterns from './patterns'

const Body = ({ add, counter }) =>
  <section>
    <section>This is the homepage</section>
    <section>
      <Theme />
    </section>
    <section>
      <Patterns />
    </section>
    <section>These are some example patterns</section>
    <section>
      This is a redux example
      <div onClick={add}>
        Hey clare. This is a testing 7 {counter}
        <Button text="test">Button</Button>
      </div>
    </section>
  </section>

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
