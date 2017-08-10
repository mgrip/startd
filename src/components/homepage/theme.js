import React from 'react'
import styled from 'styled-components'

const test = ['white', 'black', 'primary', 'lightPrimary', 'darkPrimary']

const Color = styled.span`
  background-color: ${props => props.theme.colors[props.color]};
  width: 20px;
  height: 20px;
  border-radius: 100%;
  display: inline-block;
`
const Theme = () =>
  <section>
    {test.map(color => <Color color={color} />)}
  </section>

export default Theme
