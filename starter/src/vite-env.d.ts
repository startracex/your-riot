/// <reference types="vite/client" />
declare module '*.riot' {
  const component: import('riot').RiotComponentWrapper<
    import('riot').RiotComponent
  >
  export default component
}
