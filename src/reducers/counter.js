import { createAction } from 'redux-act'

const add = createAction('Increment the counter by one')
const subtract = createAction('Decrement the counter by one')

const reducer = (state = 0, action) => {
  switch (action.type) {
    case add.getType():
      return state += 1
    case subtract.getType():
      return state -=1
    default:
      return state
  }
}

const actions = { add, subtract }
export { actions, reducer }
