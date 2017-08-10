import React from 'react'

const Button = ({ children, onClick }) =>
  <span>
    <span className="button" role="button" onClick={onClick}>
      {children}
    </span>
  </span>

export default Button
