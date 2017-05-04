import React from 'react'
import { Link } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { homepageRoute } from '../homepage/homepage'

const Header = () => (
  <section>
    <ul>
      <li><Link to={homepageRoute.path}>Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </section>
)

const mapStateToProps = state => state.navigation

export default Header
