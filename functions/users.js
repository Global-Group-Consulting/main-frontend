export default function ({ $router, $apiCalls, $alerts }) {


  function goToUser (userId) {
    $router.push('/users/' + userId)
  }

  return {
    goToUser,
  }
}
