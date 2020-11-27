export default async function ({ $auth }) {
  if ($auth.loggedIn) {
    await $auth.checkToken()
  }
}
