import { template as _template } from 'lodash'

/**
 * From an object, converts it in a valid FormData element,
 * ready to be send to the server
 *
 * @param {{}} obj
 * @param {null | FormData} [formDataInstance]
 * @param {null | string} [prefix]
 * @param {boolean} [removeEmpty] @default true
 * @returns {FormData}
 */
export function formDataFromObject(obj, formDataInstance, prefix, removeEmpty = true) {
  const formData = formDataInstance || new FormData()

  for (const entry of Object.entries(obj)) {
    const key = entry[0]
    const value = entry[1]

    if (typeof value === 'undefined' || value === null) {
      if (removeEmpty) {
        console.info('- formDataFromObject undefinedValue', entry)
      } else {
        formData.append((prefix ? `${prefix}.` : '') + key, "")
      }

      continue
    }

    if (value.constructor.name === 'Object') {
      formDataFromObject(value, formData, key)
    } else if (value.constructor.name === 'FileList') {
      for (const _file of value) {
        formData.append((prefix ? `${prefix}.` : '') + key + "[]", _file)
      }
    } else if (value instanceof Array) {
      value.forEach(entry => {
        if (entry.constructor.name === 'Object') {
          // formDataFromObject(entry, formData, (prefix ? `${prefix}.` : '') + key + '[]')
          formData.append((prefix ? `${prefix}.` : '') + key + '[]', JSON.stringify(entry))
        } else {
          formData.append((prefix ? `${prefix}.` : '') + key + '[]', entry)
        }
      })
    } else {
      formData.append((prefix ? `${prefix}.` : '') + key, value)
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

/**
 * Set the first letter of each word to uppercase
 *
 * @param {string} string
 * @return {*}
 */
export function ucWords(string) {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export default (context, inject) => {
  const utilities = {
    formDataFromObject,
    compileString,
    ucWords
  }

  // Inject $hello(msg) in Vue, context and store.
  inject('utilities', utilities)

  // For Nuxt <= 2.12, also add 👇
  context.$utilities = utilities
}
