import { template as _template } from 'lodash'

/**
 * From an object, converts it in a valid FormData element,
 * ready to be send to the server
 *
 * @param {{}} obj
 * @param {null | FormData} [formDataInstance]
 * @param {null | string} [prefix]
 * @returns {FormData}
 */
export function formDataFromObject(obj, formDataInstance, prefix) {
  const formData = formDataInstance || new FormData()

  for (const entry of Object.entries(obj)) {
    const key   = entry[0]
    const value = entry[1]

    if (typeof value === 'undefined') {
      console.info('- formDataFromObject undefinedValue', entry)

      continue
    }

    if (value.constructor.name === 'Object') {
      formDataFromObject(value, formData, key)
    } else if (value instanceof Array) {
      value.forEach(entry => formData.append((prefix ? `${ prefix }.` : '') + key + '[]', entry))
    } else {
      formData.append((prefix ? `${ prefix }.` : '') + key, value)
    }
  }

  return formData
}

/**
 * Compiles a string using lodash template
 *
 * @param {string} string
 * @param {{}} data
 */
function compileString(string, data = {}) {
  /**
   * @type {TemplateExecutor}
   */
  const tmpl = _template(string)

  return tmpl(data)
}

export default (context, inject) => {
  const utilities = {
    formDataFromObject,
    compileString
  }

  // Inject $hello(msg) in Vue, context and store.
  inject('utilities', utilities)

  // For Nuxt <= 2.12, also add 👇
  context.$utilities = utilities
}
