import React from 'react'
import { Provider, connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Header from './components/navigation/header'
import { Homepage, homepageRoute } from './components/homepage/homepage'
import theme from './theme'
import { ThemeProvider } from 'styled-components'

const routes = [homepageRoute]

const App = () =>
  <ThemeProvider theme={theme}>
    <div>
      <Header />
      {routes.map((route, key) =>
        <Route
          key={key}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      )}
    </div>
  </ThemeProvider>
export default App
