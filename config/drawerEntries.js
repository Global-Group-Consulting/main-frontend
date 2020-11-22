import UserRoles from '../enums/UserRoles'

/**
 * @typedef {{}} MenuEntry
 * @property {string | function} text
 * @property {string} [type]
 * @property {[]} [childs]
 * @property {string} [id]
 * @property {string} [icon]
 * @property {string} [link]
 * @property {[Number<UserRoles>]} [ruoli]
 */

const menuItems = [
  {
    id: 'dashboard',
    text: 'dashboard',
    icon: 'mdi-home',
    link: '/'
  },
  {
    type: 'group',
    text: ruolo => [UserRoles.SUPER_ADMIN,
    UserRoles.ADMIN,
    UserRoles.SERV_CLIENTI]
      .includes(ruolo) ? 'users-management' : 'my-account',
    childs: [
      {
        id: 'users',
        text: ruolo => UserRoles.AGENTE ? 'clients' : 'users',
        icon: 'mdi-account-group',
        link: '/users',
        ruoli: [UserRoles.ADMIN, UserRoles.SERV_CLIENTI, UserRoles.AGENTE]
      },
      {
        id: 'movements',
        text: 'movements',
        icon: 'mdi-swap-horizontal',
        link: '/movements',
        ruoli: [UserRoles.CLIENTE, UserRoles.AGENTE]
      },
      {
        id: 'requests',
        text: 'requests',
        icon: 'mdi-fire',
        link: '/requests',
        ruoli: [UserRoles.ADMIN, UserRoles.AGENTE, UserRoles.CLIENTE]
      },
    ]
  },
  {
    type: 'group',
    text: 'utilities',
    childs: [
      {
        id: 'calculator',
        text: 'calculator',
        icon: 'mdi-calculator-variant',
        link: '/calculator'
      },
      {
        id: 'comunications',
        text: 'comunications',
        icon: 'mdi-email-multiple',
        link: '/comunications'
      }
    ]
  },
  {
    type: 'group',
    text: 'advanced',
    ruoli: [UserRoles.SUPER_ADMIN],
    childs: [
      {
        id: 'translations',
        text: 'translations',
        icon: 'mdi-translate',
        link: '/traduzioni',
        ruoli: [UserRoles.ADMIN, UserRoles.SERV_CLIENTI]
      },
      {
        id: 'developer',
        text: 'developer',
        icon: 'mdi-bug',
        link: '/sviluppatore',
        ruoli: [UserRoles.SUPER_ADMIN],
        childs: [
          {
            id: 'emailStatuses',
            text: 'emailStatuses',
            icon: 'mdi-email-search',
            link: '/sviluppatore/email'
          },
          {
            id: 'errors',
            text: 'errors',
            icon: 'mdi-bug',
            link: '/sviluppatore/errori'
          }
        ]
      }
    ]
  }
]

/**
 * @param {MenuEntry} entry
 * @param {Number<UserRoles>} ruolo
 * @return {{}|null}
 * @private
 */
function _analyzeEntry(entry, ruolo, i18n) {
  const newEntry = { ...entry }

  // Se il parametro è una function la esegue, passando il ruolo e l'entry come parametri
  if (entry.text && typeof entry.text === 'function') {
    newEntry.text = entry.text(ruolo, entry)
  }

  newEntry.text = i18n.t('drawer.' + newEntry.text)

  // Se ci sono childs, li analizza tutti.
  if (entry.childs) {
    newEntry.childs = _loopEntries(entry.childs, ruolo, i18n)
  }

  if (!entry.ruoli
    || ruolo === UserRoles.SUPER_ADMIN
    || entry.ruoli.includes(ruolo)) {
    return newEntry
  }
}

/**
 * @param {[]} childs
 * @param {Number<UserRoles>} ruolo
 * @return {[]}
 * @private
 */
function _loopEntries(childs, ruolo, i18n) {
  return childs.reduce((acc, curr) => {
    const newCurr = _analyzeEntry(curr, ruolo, i18n)

    if (newCurr) {
      acc.push(newCurr)
    }

    return acc
  }, [])
}

export default function (context) {
  return _loopEntries(menuItems, context.$auth.user.role, context.$i18n)
}
