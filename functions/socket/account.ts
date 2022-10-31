import {onMounted, ref} from "@vue/composition-api";
import {User} from "~/@types/UserFormData";


export default function (context: Vue) {
  const {$socket} = context
  let topic = ref()

  function wsOnAccountUpdated(user: User) {
    context.$auth.fetchUser()
  }

  async function connectToTopic() {
    let reconnectionInterval

    try {
      topic.value = await $socket.account()

      topic.value.on("accountUpdated", wsOnAccountUpdated)
      topic.value.on("close", () => {
        if (!$socket.mustRetry) {
          return
        }

        reconnectionInterval = setTimeout(async () => {
          await connectToTopic()
        }, 1000)
      })
    } catch (er) {
      console.error(er)
      reconnectionInterval = setTimeout(async () => {
        await connectToTopic()
      }, 1000)
    }
  }

  onMounted(async () => {
    await connectToTopic()
  })
}
