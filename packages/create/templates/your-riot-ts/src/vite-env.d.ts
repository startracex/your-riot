/// <reference types="vite/client" />
declare module '*.riot' {
  import { RiotComponentWrapper, RiotComponent } from '@your-riot/riot'
  const component: RiotComponentWrapper<RiotComponent>
  export default component
}
