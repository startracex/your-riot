import User from './user.riot'
import { describe, it, expect } from 'vitest'
import { component } from 'riot'

describe('User Unit Test', () => {
  const mountUser = component(User)

  it('The component is properly rendered', () => {
    const div = document.createElement('div')

    const component = mountUser(div, {
      name: 'Jack',
    })

    expect(component.$('b').innerHTML).toBe('Jack')
  })
})