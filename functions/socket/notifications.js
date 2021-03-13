import {onMounted, ref, computed} from "@vue/composition-api"

import {moneyFormatter} from "@/plugins/filters"

import NotificationTypes from "@/enums/NotificationTypes";

export default function ({$socket, $set, $i18n, $router, $alerts}) {
  const unreadMessages = ref([])
  let topic = ref({})

  function onNotificationClick(message) {
    /**
     * @type {string}
     */
    const type = message.type


    if (type.startsWith("request")) {
      $router.push("/requests#" + message.payload.id)
    } else if (type.startsWith("user")) {
      $router.push("/users/" + message.payload.id)
    } else if (type.startsWith("message")) {
      $router.push("communications#" + (message.payload.conversationId || message.payload.id))
    }

    signAsRead(message)

    // Based on the type, redirect to a different page
  }

  function signAsRead(message) {
    try {
      topic.value.emit("setAsRead", message.id)
    } catch (er) {
      $alerts.error(er)
    }
  }

  function getNotificationMessage(message) {
    const data = message.payload

    if (data.amountChange) {
      data.amount = moneyFormatter(+data.amountChange)
    }

    return $i18n.t(`enums.NotificationTypes.${message.type}_message`, data)
  }

  function wsOnUnreadMessages(data) {
    // Must set them as notified

    unreadMessages.value = data.map(_entry => {
      _entry.hover = false

      return _entry
    })
  }

  function wsOnSetAsRead(data) {
    const msgIndex = unreadMessages.value.findIndex(_msg => _msg.id === data.id)

    unreadMessages.value.splice(msgIndex, 1)
  }

  function wsOnNewNotification(data) {
    data.hover = false

    unreadMessages.value.unshift(data)
  }

  async function connectToTopic() {
    let reconnectionInterval

    try {
      topic.value = await $socket.notifications()

      topic.value.on("unreadMessages", wsOnUnreadMessages)
      topic.value.on("setAsRead", wsOnSetAsRead)
      topic.value.on("newNotification", wsOnNewNotification)

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

  return {
    notifications: topic,
    unreadMessages,
    getNotificationMessage,
    onNotificationClick,
    signAsRead
  }
}
