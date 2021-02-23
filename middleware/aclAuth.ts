import {Middleware} from '@nuxt/types'

const aclMiddleware: Middleware = (context) => {
  const {route, redirect, $acl} = context
  const meta = route.meta || []
  const permissions = meta.find((_el: any) => Object.keys(_el).includes("permissions")) || {}
  const requiredPermissions = permissions["permissions"]

  if (!$acl.checkPermissions(requiredPermissions)) {
    return redirect("/")
  }
}

export default aclMiddleware
