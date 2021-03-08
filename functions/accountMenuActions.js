export default function ({$socket, $alerts, $i18n, $auth, $router}) {
  async function logout() {
    try {
      const result = await $alerts.ask({
        title: $i18n.t("alerts.logout-title"),
        text: $i18n.t("alerts.logout-text")
      });

      await $auth.logout("local");

      $socket.close()

    } catch (er) {
      console.log(er);
    }
  }

  async function vieMyProfile() {
    $router.push("/users/" + $auth.user.id);
  }

  return {
    logout,
    vieMyProfile
  }
}
