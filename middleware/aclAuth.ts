import {Middleware} from '@nuxt/types'

const aclMiddleware: Middleware = (context) => {
  const {route, redirect, $acl, store} = context
  const meta = route.meta || []
  const permissions = meta.find((_el: any) => Object.keys(_el).includes("permissions")) || {}
  const requiredPermissions = permissions["permissions"]

  if (!$acl.checkPermissions(requiredPermissions)) {
    return redirect("/")
  }

  const currentRoute = store.$router.currentRoute;

  if (currentRoute) {
    // Resets the current active filters before leaving a page
    store.dispatch("filters/resetAll", {
      page: currentRoute.path
    });
  }

  store.dispatch("route/updateRoute", {
    path: route.path,
    fullPath: route.fullPath,
    hash: route.hash,
    meta: route.meta,
    name: route.name,
    params: route.params,
    query: route.query,
  })
}

export default aclMiddleware
