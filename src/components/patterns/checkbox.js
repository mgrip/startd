import React from 'react'
import styled from 'styled-components'

const Checkbox = ({ checked, onToggle, value }) => {
  const Input = styled.input`
    position: absolute;
    z-index: -1;
    opacity: 0;
  `
  const Display = styled.div`
    height: 20px;
    width: 20px;
    background-color: #e6e6e6;
    border-radius: 50%;
    &:hover {
      background-color: red;
    }
    & checked:after {
      top: 4px;
      left: 8px;
      width: 3px;
      height: 8px;
      transform: rotate(45deg);
      border: solid #fff;
      border-width: 0 2px 2px 0;
    }
  `
  return (
    <span>
      <Input checked={checked} value={value} type="checkbox" />
      <Display className={checked ? 'checked' : ''} onClick={onToggle} />
    </span>
  )
}

export default Checkbox
