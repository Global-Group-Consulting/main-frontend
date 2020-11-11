import Swal from 'sweetalert2/dist/sweetalert2.js'
import Toasted from 'vue-toasted';
import Vue from 'vue'

import ToastedOptions from "../config/vue-toasted"

Vue.use(Toasted, ToastedOptions)

export class Alerts {
  constructor(i18n) {
    this.i18n = i18n
  }

  success(settings = {}) {
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

  info(settings = {}) {
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
   * @param {{}} [settings]
   */
  error(error, settings = {}) {
    let errData = {}

    if (error && error.dismiss === "cancel") {
      return
    }

    if (typeof error === 'string') {
      errData.message = error
    }

    try {
      errData = error ? JSON.parse(error.request.response) : {}
    } catch (e) { }

    if (errData instanceof Array) {
      errData = errData[0]
    }

    if (errData.error) {
      errData = errData.error
    }

    let text = this.i18n.t('errors.default')

    if (errData && errData.message) {
      if (this.i18n.te('errors.' + errData.message)) {
        text = this.i18n.t('errors.' + errData.message)
      } else {
        text += '<br>' + errData.message
      }
    } else if (errData && errData.error) {
      text += '<br>' + JSON.stringify(errData.error)
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

  async ask(settings = {}) {
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

    return new Promise((resolve, reject) => {
      Swal.fire(Object.assign({}, defaultSettings, settings))
        .then((res) => {
          if (res.isConfirmed) {
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch((er) => reject(er))
    })
  }

  /**
   *
   * @param {{ key: string, preConfirm: function, data: {}, settings: {}}} options
   *
   * @return {Promise<void>}
   */
  async askBeforeAction({ key, preConfirm, data, settings }) {
    const title = this.i18n.t(`alerts.${key}-title`, data)
    const html = this.i18n.t(`alerts.${key}-text`, data)
    const confirmButtonText = this.i18n.t(`alerts.${key}-confirmBtnText`)
    const cancelButtonText = this.i18n.t(`alerts.${key}-cancelBtnText`)

    const askSettings = {
      title: title,
      html: html
    }

    confirmButtonText && (askSettings['confirmButtonText'] = confirmButtonText)

    cancelButtonText && (askSettings['cancelButtonText'] = cancelButtonText)

    await this.ask({
      ...askSettings,
      ...settings,
      preConfirm: async () => {
        try {
          await preConfirm()

          return this.toastSuccess(`${key}-success`)
        } catch (er) {
          return this.error(er)
        }
      }
    })
  }

  toastSuccess(message) {
    Vue.toasted.success(this.i18n.t("alerts." + message))
  }
}

export default (context, inject) => {
  const alerts = new Alerts(context.app.i18n)

  inject('alerts', alerts)

  // For Nuxt <= 2.12, also add 👇
  if (!context.$alerts) {
    context.$alerts = alerts
  }
}
