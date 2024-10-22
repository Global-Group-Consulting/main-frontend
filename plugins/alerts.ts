// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Toasted, { ToastObject, ToastOptions } from 'vue-toasted'
// @ts-ignore
import Vue from 'vue'

import ToastedOptions from '../config/vue-toasted'
import { Context, Plugin } from '@nuxt/types'
import { SweetAlertIcon, SweetAlertOptions, SweetAlertPosition, SweetAlertResult } from 'sweetalert2'

Vue.use(Toasted, ToastedOptions)

interface ErrorData {
  message?: string
  error?: any
}

interface AlertSettings extends SweetAlertOptions {
  /* title?: string
   text?: string
   html?: string
   icon?: any
   confirmButtonText?: string
   cancelButtonText?: string
   showCancelButton?: boolean
   allowOutsideClick?: boolean
   preConfirm?: any
   showLoaderOnConfirm?: boolean
   confirmButtonColor?: string

   onOpen?(el: HTMLElement, a: any, b: any): void
 */
}

// @ts-ignore
declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $alerts: Alerts
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $alerts: Alerts
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $alerts: Alerts
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $alerts: Alerts
  }
}

export class Alerts {
  private i18n
  private store
  
  public instance: any
  
  constructor (context: Context) {
    this.i18n = context.app.i18n
    this.store = context.app.store
    this.instance = Swal
  }
  
  close () {
    Swal.close()
  }
  
  success (settings: AlertSettings = {}) {
    if (typeof settings === 'string') {
      settings = {
        title: settings
      }
    }
    
    const defaultSettings = {
      title: 'Operazione eseguita correttamente!',
      text: '',
      icon: 'success',
      confirmButtonText: 'Chiudi'
    }

    return Swal.fire(Object.assign({}, defaultSettings, settings))
  }

  info(settings: AlertSettings | string = {}) {
    if (typeof settings === 'string') {
      settings = {
        title: settings
      }
    }

    const defaultSettings = {
      title: 'Operazione eseguita correttamente!',
      text: '',
      icon: 'info',
      confirmButtonText: 'Chiudi'
    }

    return Swal.fire(Object.assign({}, defaultSettings, settings))
  }

  /**
   *
   * @param {any} error
   * @param {AlertSettings} [settings]
   */
  error(error: any, settings: AlertSettings = {}) {
    let errData: ErrorData = {}

    if (error && error.dismiss === "cancel") {
      return
    }

    if (typeof error === 'string') {
      errData.message = error
    }

    try {
      errData = error ? JSON.parse(error.request.response) : {}
    } catch (e) {
    }

    if (errData instanceof Array) {
      errData = errData[0]
    }

    if (errData && errData.error) {
      errData = errData.error
    }

    // use default error message if no message is provided
    let text = settings.text ? settings.text : this.i18n.t('errors.default')

    if (errData && errData.message) {
      if (this.i18n.te('errors.' + errData.message)) {
        text = this.i18n.t('errors.' + errData.message)
      } else {
        // when no translation is found, use the message from the server without showing the generic message
        text = errData.message
      }
    } else if (errData && errData.error) {
      text += '<br><br>' + JSON.stringify(errData.error)
    }
  
    const defaultSettings = {
      title: this.i18n.t('errors.title'),
      html: text,
      icon: 'error',
      confirmButtonText: this.i18n.t('errors.closeBtn')
    }

    console.log(error)

    return Swal.fire(Object.assign({}, defaultSettings, settings))
  }

  async ask(settings: AlertSettings = {}): Promise<SweetAlertResult> {
    const defaultSettings = {
      title: '',
      text: '',
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      allowOutsideClick: false
    }

    if (settings.preConfirm) {
      settings.showLoaderOnConfirm = true
    }

    /* if (this.store.getters("dialog/dialogState")) {
      this.store.dispatch("dialog/updateRetainFocus", false)
    } */

    return new Promise((resolve, reject) => {
      Swal.fire(Object.assign({}, defaultSettings, settings))
        .then((res: any) => {
          /*  if (this.store.getters("dialog/dialogState")) {
             this.store.dispatch("dialog/updateRetainFocus", true)
           } */

          if (res.isConfirmed) {
            resolve(res)
          } else {
            reject(res)
          }

        })
        .catch((er: Error) => {
          reject(er)

          /*  if (this.store.getters("dialog/dialogState")) {
             this.store.dispatch("dialog/updateRetainFocus", true)
           } */
        })
    })
  }

  /**
   *
   *
   * @return {Promise<void>}
   * @param payload
   */
  async askBeforeAction(payload: { key: string, preConfirm: any, data?: any, settings?: AlertSettings }) {
    const {key, preConfirm, data, settings} = payload
    const title = this.i18n.t(`alerts.${key}-title`, data) as string
    const html = this.i18n.t(`alerts.${key}-text`, data) as string
    const confirmButtonText = this.i18n.t(`alerts.${key}-confirmBtnText`) as string
    const cancelButtonText = this.i18n.t(`alerts.${key}-cancelBtnText`) as string

    const askSettings: AlertSettings = {
      title: title,
      html: html
    }

    confirmButtonText && (askSettings['confirmButtonText'] = confirmButtonText)

    cancelButtonText && (askSettings['cancelButtonText'] = cancelButtonText)

    await this.ask({
      ...askSettings,
      ...settings,
      preConfirm: async (value: any) => {
        try {
          if (preConfirm) {
            await preConfirm(value)
            
            return this.toastSuccess(`${key}-success`)
          }
        } catch (er) {
          return this.error(er)
        }
      }
    })
  }
  
  toastSuccess (message: string) {
    Vue.toasted.success(this.i18n.t('alerts.' + message) as string)
  }
  
  toast (text: string, settings: ToastOptions) {
    Vue.toasted.show(text, {
      icon: settings.icon,
      duration: settings.duration ?? 4000,
      type: settings.type,
      position: settings.position,
      // theme: settings.theme ?? "bubble",
      iconPack: 'mdi',
      action: settings.action
    })
  }
}

const alertsPlugin: Plugin = (context, inject) => {
  const alerts = new Alerts(context)

  inject('alerts', alerts)
}

export default alertsPlugin
