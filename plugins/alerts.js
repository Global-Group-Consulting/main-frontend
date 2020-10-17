import Swal from 'sweetalert2/dist/sweetalert2.js'
import Vue from 'vue'

class Alerts {
  constructor (i18n) {
    this.i18n = i18n
  }

  success (settings = {}) {
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

  error (error, settings = {}) {
    let errData = {}

    if (typeof error === 'string') {
      errData.message = error
    }

    try {
      errData = error ? JSON.parse(error.request.response) : {}
    } catch (e) {}

    let text = this.i18n.t('errors.default')

    if (errData && errData.message && this.i18n.te('errors.' + errData.message)) {
      text = this.i18n.t('errors.' + errData.message)
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

  async ask (settings = {}) {
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

    return Swal.fire(Object.assign({}, defaultSettings, settings))
  }

  /**
   *
   * @param {{}} options
   * @param {string} options.key
   * @param {function} options.preConfirm
   * @param {{string}} [options.data]
   *
   * @return {Promise<void>}
   */
  async askBeforeAction (options) {
    const title = this.i18n.t(`alerts.${key}-title`, options.data)
    const html = this.i18n.t(`alerts.${key}-text`, options.data)
    const confirmButtonText = this.i18n.t(`alerts.${key}-confirmBtnText`)
    const cancelButtonText = this.i18n.t(`alerts.${key}-cancelBtnText`)

    const askSettings = {
      title: title,
      text: html
    }

    confirmButtonText && (askSettings['confirmButtonText'] = confirmButtonText)

    cancelButtonText && (askSettings['cancelButtonText'] = cancelButtonText)

    await this.$Alerts.ask({
      ...askSettings,

      preConfirm: async () => {
        try {
          await options.preConfirm()

          return this.toastSuccess(`${key}-success`)
        } catch (er) {
          return this.$Alerts.error(er)
        }
      }
    })
  }

  toastSuccess (message) {
    Vue.toasted.success(message)
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
