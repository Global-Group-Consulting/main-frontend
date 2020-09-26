export default function ({ $router }) {
  function goToUser (userId) {
    $router.push('/users/' + userId)
  }

  return {
    goToUser
  }
}
