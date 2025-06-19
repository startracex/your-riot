import { router } from 'rawth'

const getCurrentRoute: () => string = ((currentRoute) => {
  // listen the route changes events to store the current route
  router.on.value((r) => (currentRoute = r))

  return () => {
    return currentRoute
  }
})(null)

export { getCurrentRoute }
