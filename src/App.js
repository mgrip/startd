import React from 'react'
import { Provider, connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Header from './components/navigation/header'
import { Homepage, homepageRoute } from './components/homepage/homepage'
import { colors, font } from './theme'

const routes = [homepageRoute]

const App = () => (
  <div>
    <Header />
    {routes.map((route, key) => (
      <Route
        key={key}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    ))}
  </div>
)
export default App
