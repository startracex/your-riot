import { RiotComponent, RiotComponentWrapper } from '@your-riot/riot'
// @ts-ignore
import _Route from './components/route-hoc.riot'
// @ts-ignore
import _Routes from './components/routes-hoc.riot'
import { URLWithParams } from 'rawth'

const Route: RiotComponentWrapper<
  RiotComponent<{
    path: string
    'on-before-mount'?: (path: URLWithParams) => void
    'on-mounted'?: (path: URLWithParams) => void
    'on-before-unmount'?: (path: URLWithParams) => void
    'on-unmounted'?: (path: URLWithParams) => void
  }>
> = _Route

const Routes: RiotComponentWrapper<
  RiotComponent<{
    base?: string
    'initial-route'?: string
    'on-started'?: (route: string) => void
  }>
> = _Routes

export { Routes, Route }
