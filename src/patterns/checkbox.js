import React from 'react'
import styled from 'styled-components'

const Checkbox = ({ checked, onToggle, value }) => {
  const Span = styled.span``

  const Input = styled.input`
    position: absolute;
    z-index: -1;
    opacity: 0;
  `
  const Display = styled.div`
    height: 20px;
    width: 20px;
    background-color: #e6e6e6;
    display: inline-block;
    &:hover {
      background-color: red;
    }
    ${Span}.checked &:after {
      content: '';
      position: relative;
      display: inline-block;
      left: 30%;
      width: 35%;
      height: 70%;
      transform: rotate(45deg);
      border: solid #fff;
      border-width: 0 2px 2px 0;
    }
  `
  return (
    <Span className={checked ? 'checked' : ''}>
      <Input checked={checked} value={value} type="checkbox" readOnly />
      <Display onClick={onToggle} />
    </Span>
  )
}

export default Checkbox
