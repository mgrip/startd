import React from 'react'

const Input = ({ children, onClick }) =>
  <section>
    <label htmlFor="text-input-1" className="bx--label">
      Text field label
    </label>
    <input
      id="text-input-1"
      type="text"
      className="bx--text-input"
      placeholder="Hint text here"
    />
  </section>

export default Input
