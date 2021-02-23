import {PortfolioPermissions} from "~/functions/acl/enums/portfolio.permissions";
import {UsersPermissions} from "~/functions/acl/enums/users.permissions";
import {RequestsPermissions} from "~/functions/acl/enums/requests.permissions";
import {AclPermissions} from "~/functions/acl/enums/acl.permissions";
import {ClubPermissions} from "~/functions/acl/enums/club.permissions";

interface DrawerEntry {
  id?: string
  text: string
  icon?: string
  link?: string
  permissions?: string[]
  if?: boolean
  type?: "group"
  childs?: DrawerEntry[]
}

export default function (context: Vue): DrawerEntry[] {

  return [
    {
      id: 'dashboard',
      text: 'dashboard',
      icon: 'mdi-home',
      link: '/'
    },
    {
      type: 'group',
      text: 'portfolio',
      childs: [
        {
          id: 'users',
          text: 'clients',
          icon: 'mdi-account-group',
          link: '/users',
          permissions: [UsersPermissions.ACL_USERS_GROUP_READ]
        },
        {
          id: 'wallet',
          text: "wallet",
          icon: 'mdi-wallet',
          link: '/wallet',
          permissions: [PortfolioPermissions.ACL_PORTFOLIO_SELF_READ],
        }
      ]
    },
    {
      type: 'group',
      text: "pippo",
      /* text: [UserRoles.SUPER_ADMIN,
         UserRoles.ADMIN,
         UserRoles.SERV_CLIENTI]
         .includes(role) ? 'users-management' : 'my-account',*/
      childs: [
        {
          id: 'users',
          text: 'users',
          icon: 'mdi-account-group',
          link: '/users',
          permissions: [UsersPermissions.ACL_USERS_ALL_READ],
        },
        {
          id: 'movements',
          text: 'movements',
          icon: 'mdi-swap-horizontal-bold',
          link: '/movements',
          permissions: ["movements.self:read"]
        },
        {
          id: 'requests',
          text: 'requests',
          icon: 'mdi-list-status',
          link: '/requests',
          permissions: [RequestsPermissions.ACL_REQUESTS_SELF_READ, RequestsPermissions.ACL_REQUESTS_ALL_READ]
        },
      ]
    },
    {
      type: 'group',
      text: 'club',
      childs: [
        {
          id: 'club',
          text: 'club',
          icon: 'mdi-diamond-stone',
          link: '/club',
          permissions: [ClubPermissions.BRITES_ALL_READ]
        }, {
          id: 'club',
          text: 'club',
          icon: 'mdi-diamond-stone',
          link: '/club/' + context.$auth.user.id,
          permissions: [ClubPermissions.BRITES_SELF_READ],
          if: context.$auth.user.gold
        }
      ]
    },
    {
      type: 'group',
      text: 'utilities',
      childs: [
        {
          id: 'comunications',
          text: 'comunications',
          icon: 'mdi-email-multiple',
          link: '/communications',
          // permissions: [CommunicationsPermissions.ACL_COMMUNICATIONS_SELF_READ, CommunicationsPermissions.ACL_COMMUNICATIONS_ALL_READ]
        },
        {
          id: 'calculator',
          text: 'calculator',
          icon: 'mdi-calculator-variant',
          link: '/calculator'
        }
      ]
    },
    {
      type: 'group',
      text: 'advanced',
      // permissions: ['translations:read', 'developer:read'],
      childs: [
        /*{
          id: 'translations',
          text: 'translations',
          icon: 'mdi-translate',
          link: '/traduzioni',
          permissions: ["translations:read"]
        },*/
        {
          id: 'acl',
          text: 'acl',
          icon: 'mdi-shield-account',
          link: '/acl',
          permissions: [AclPermissions.ACL_ACL_READ]
        },
        /*{
          id: 'emailStatuses',
          text: 'emailStatuses',
          icon: 'mdi-email-search',
          link: '/sviluppatore/email'
        },*/
        /*{
          id: 'errors',
          text: 'errors',
          icon: 'mdi-bug',
          link: '/sviluppatore/errori'
        }*/
      ]
    }
  ]

}
