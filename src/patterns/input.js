import React from 'react'

const Input = ({ value, label, onChange }) =>
  <label>
    {label}
    <input type="text" value={value} onChange={onChange} />
  </label>

export default Input
