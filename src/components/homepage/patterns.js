import React from 'react'
import Button from '../patterns/button'
import Card from '../patterns/card'
import Checkbox from '../patterns/checkbox'
import Input from '../patterns/input'
import Select from '../patterns/select'

const Patterns = () =>
  <section>
    <Button>Test Button</Button>
    <Card />
    <Checkbox checked={true} />
    <Input />
    <Select />
  </section>
export default Patterns
