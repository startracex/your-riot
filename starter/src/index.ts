import { mount } from 'riot'
import registerGlobalComponents from './register-global-components'
import './style.css'

// register
registerGlobalComponents()

// mount all the global components found in this page
mount('[data-riot-component]')
