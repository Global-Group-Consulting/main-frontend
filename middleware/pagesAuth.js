import Permissions from "../functions/permissions"

const users = function ({ redirect }, permissions) {
  if (!permissions.seeOtherUsers) {
    redirect("/")
  }
}

const usersId = function ({ redirect, $auth, route }, permissions) {
  const userId = $auth.user.id

  if (route.params.id !== userId && !permissions.seeOtherUsers) {
    redirect("/")
  }
}

const guards = {
  users,
  "users-id": usersId
}

export default function (context) {
  const permissions = Permissions(context)
  const { route, redirect } = context
  const path = route.path
  const pathName = route.name.slice(0, route.name.indexOf("_"))


  debugger
  if (guards[pathName]) {
    return guards[pathName](context, permissions)
  }
}
