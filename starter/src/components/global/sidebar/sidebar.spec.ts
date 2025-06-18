import Sidebar from './sidebar.riot'
import { describe, it, expect } from 'vitest'
import { component } from 'riot'

describe('Sidebar Unit Test', () => {
  const mountSidebar = component(Sidebar)

  it('The component is properly rendered', () => {
    const div = document.createElement('div')

    const component = mountSidebar(div)

    expect(component.$('h1').innerHTML).toBe('Sidebar')
  })
})