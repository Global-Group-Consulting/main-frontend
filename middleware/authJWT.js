export default async function ({$auth, route}) {
  const guestsPages = ["/login", "/auth/activate", "/auth/forgot", "/auth/recover"]

  if (!guestsPages.includes(route.path) && $auth.loggedIn) {
    await $auth.checkToken()
  }
}
