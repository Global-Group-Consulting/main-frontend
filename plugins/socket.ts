// @ts-ignore
import Ws from '@adonisjs/websocket-client'

import {Ref, ref} from "@vue/composition-api"
import {Context, Plugin} from "@nuxt/types";


declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $socket: Socket
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $socket: Socket
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $socket: Socket
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $socket: Socket
  }
}

class Socket {
  private ws
  private isConnected: Ref<boolean>
  public mustRetry: boolean
  private topics: any
  private connections: any[]
  private pendingConnections: any[]

  constructor(context: Context) {
    this.ws = Ws(context.env.SOCKET_URL)

    this.isConnected = ref(false)
    this.mustRetry = true
    this.topics = {}
    this.connections = []
    this.pendingConnections = []

    // @ts-ignore
    window.ws = this.ws
  }

  async _connect() {
    const ctx = this

    return new Promise((resolve) => {
      this.ws.on('open', () => {
        ctx.isConnected.value = true

        if (Object.keys(ctx.topics).length > 0) {
          for (const topic in ctx.topics) {
            // ctx._subscribe(topic)
          }
        }

        ctx.mustRetry = true

        resolve(this.ws)
      })

      this.ws.on('close', () => {
        ctx.isConnected.value = false
      })

      const token = (localStorage.getItem("auth._token.refreshScheme") || "").split(" ")[1]

      this.ws
        .withJwtToken(token)
        .connect()
    })
  }

  async _subscribe(channel: string) {
    if (!this.isConnected.value) {
      await this._connect()
    }

    const ws = this.ws

    const topicInstance = this.ws.subscribe(channel)

    const topic = {
      connected: false,
      emit(...attrs: any[]) {
        ws.getSubscription(channel).emit(...attrs)
      },
      on(...attrs: any[]) {
        ws.getSubscription(channel).on(...attrs)
      }
    }

    if (this.topics[channel]) {
      this.topics[channel].connected = false
    } else {
      this.topics[channel] = topic
    }

    return new Promise((resolve, reject) => {
      topicInstance.on('ready', () => {
        console.info("**** READY")

        topic.connected = true

        resolve(topic)
      })
      topicInstance.on('error', (error: Error) => {
        console.log(error)

        topic.connected = false

        reject(error)
      })
      topicInstance.on('close', () => {
        console.warn("***** CLOSED connection to channel ", channel)

        topic.connected = false

        delete this.topics[channel]
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

  async account() {
    const topic = "account"
    if (!this.topics[topic] || !this.topics[topic].connected) {
      this.topics[topic] = await this._subscribe(topic)
    }

    return this.topics[topic]
  }

  close() {
    this.ws.close()
    this.mustRetry = false
  }
}

const socketPlugin: Plugin = (context, inject) => {
  const socket = new Socket(context)

  inject('socket', socket)
}

export default socketPlugin
