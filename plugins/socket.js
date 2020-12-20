import Ws from '@adonisjs/websocket-client'

import {ref} from "@vue/composition-api"

class Socket {
  constructor(context) {
    this.ws = Ws(context.env.SOCKET_URL)

    this.isConnected = ref(false)
    this.topics = {}
    this.connections = []
    this.pendingConnections = []

    window.ws = this.ws
  }

  async _connect() {
    const ctx = this

    return new Promise((resolve, reject) => {
      this.ws.on('open', (data, a, b) => {
        ctx.isConnected.value = true

        if (Object.keys(ctx.topics).length > 0) {
          for (const topic in ctx.topics) {
            // ctx._subscribe(topic)
          }
        }

        resolve(this.ws)
      })

      this.ws.on('close', () => {
        ctx.isConnected.value = false
      })

      this.ws
        .withJwtToken(localStorage.getItem("auth._token.refreshScheme").split(" ")[1])
        .connect()
    })
  }

  async _subscribe(channel) {
    if (!this.isConnected.value) {
      await this._connect()
    }

    const ws = this.ws

    const topicInstance = this.ws.subscribe(channel)

    const topic = {
      connected: false,
      emit(...attrs) {
        ws.getSubscription(channel).emit(...attrs)
      },
      on(...attrs) {
        ws.getSubscription(channel).on(...attrs)
      }
    }

    if (this.topics[topic]) {
      this.topics[topic].connected = false
    } else {
      this.topics[topic] = topic
    }

    return new Promise((resolve, reject) => {
      topicInstance.on('ready', () => {
        console.info("**** READY")

        topic.connected = true

        resolve(topic)
      })
      topicInstance.on('error', (error) => {
        console.log(error)

        topic.connected = false

        reject(error)
      })
      topicInstance.on('close', () => {
        console.warn("***** CLOSED connection to channel ", channel)

        topic.connected = false

        delete this.topics[topic]
      })
    })
  }

  async notifications() {
    const topic = "notifications"
    if (!this.topics[topic] || !this.topics[topic].connected) {
      this.topics[topic] = await this._subscribe(topic)
    }

    return this.topics[topic]
  }
}

export default (context, inject) => {
  const socket = new Socket(context)

  inject('socket', socket)
}
