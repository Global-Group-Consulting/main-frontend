import { PortfolioPermissions } from '~/functions/acl/enums/portfolio.permissions'
import { UsersPermissions } from '~/functions/acl/enums/users.permissions'
import { RequestsPermissions } from '~/functions/acl/enums/requests.permissions'
import { CalculatorPermissions } from '~/functions/acl/enums/calculator.permissions'
import { SettingPermissions } from '~/functions/acl/enums/setting.permissions'
import { MagazinePermissions } from '~/functions/acl/enums/magazine.permissions'
import { ReportsPermissions } from '~/functions/acl/enums/reports.permissions'
import { AclUserRoles } from '~/enums/AclUserRoles'

export interface DrawerEntry {
  id?: string
  text: string
  icon?: string
  link?: string
  permissions?: string[]
  hideInMobile?: boolean
  if?: boolean
  type?: "group"
  childs?: DrawerEntry[]
  roles? : AclUserRoles[]
}

export default function (context: Vue): DrawerEntry[] {

  return [
    {
      id: 'dashboard',
      text: 'dashboard',
      icon: 'mdi-home',
      link: '/',
      hideInMobile: true
    },
    {
      type: 'group',
      text: 'portfolio',
      roles: [AclUserRoles.AGENT],
      childs: [
        {
          id: 'users',
          text: 'clients',
          icon: 'mdi-account-group',
          link: '/users',
          permissions: [UsersPermissions.ACL_USERS_TEAM_READ],
          hideInMobile: true
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
          hideInMobile: true
        },
        {
          id: 'movements',
          text: 'movements',
          icon: 'mdi-swap-horizontal-bold',
          link: '/movements',
          permissions: ["movements.self:read"],
          roles: [AclUserRoles.AGENT, AclUserRoles.CLIENT],
          hideInMobile: true
        },
        {
          id: 'requests',
          text: 'requests',
          icon: 'mdi-list-status',
          link: '/requests',
          permissions: [RequestsPermissions.ACL_REQUESTS_SELF_READ, RequestsPermissions.ACL_REQUESTS_ALL_READ],
          hideInMobile: true
        },
      ]
    },
    /*{
      type: 'group',
      text: 'club',
      childs: [
        {
          id: 'club',
          text: 'club',
          icon: 'mdi-diamond-stone',
          link: '/club',
          permissions: [ClubPermissions.CLUB_READ]
        }, {
          id: 'club',
          text: 'club-self',
          icon: 'mdi-diamond-outline',
          link: '/club/' + context.$auth.user.id,
          permissions: [ClubPermissions.BRITES_SELF_READ],
          if: context.$auth.user.gold && !context.$acl.checkPermissions([ClubPermissions.CLUB_READ])
        }
      ]
    },*/
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
          link: '/calculator',
          permissions: [CalculatorPermissions.CALCULATOR_READ]
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

export function BottomDrawerEntries(context: Vue): DrawerEntry[] {
  return [
    {
      id: 'calendar',
      text: 'calendar',
      icon: 'mdi-calendar',
      link: '/calendar',
      // @ts-ignore
      if: context.$store.getters['user/canSeeCalendar']
    },
    {
      id: 'reports',
      text: 'reports',
      icon: 'mdi-file-chart',
      link: '/reports',
      permissions: [ReportsPermissions.REPORTS_READ]
    },
    {
      id: 'magazine',
      text: 'magazine',
      icon: 'mdi-book-open-page-variant',
      link: '/magazine',
      permissions: [MagazinePermissions.MAGAZINE_WRITE]
    },
    {
      id: 'settings',
      text: 'settings',
      icon: 'mdi-cog',
      link: '/settings',
      permissions: [SettingPermissions.SETTINGS_ALL_READ]
    }]
}
