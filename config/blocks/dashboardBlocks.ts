import UserRoles from "~/enums/UserRoles";
import AccountStatuses from "~/enums/AccountStatuses";

export type BlockAction = "addDeposit"
  | "addCommissions"
  | "showMovementsList"
  | "collectDeposit"
  | "collectInterests"
  | "collectCommissions"

export interface BlockData {
  title: string
  icon?: string
  color?: string
  value: string
  actionText?: string | ((context: Vue, readonly: boolean) => string)
  action?: null | BlockAction | ((context: Vue, readonly: boolean) => BlockAction)
}

function getAccountStatusColor(status: string) {
  return AccountStatuses.get(status).color || "#c1c1c1"
}

const data: Record<string, BlockData> = {
  deposit: {
    title: "deposit",
    icon: "mdi-cloud-upload",
    color: "blue",
    value: "deposit",
    actionText: "depositAdd",
    action: "addDeposit"
  },
  interestAmount: {
    title: "interests",
    icon: "mdi-chart-timeline-variant",
    color: "green",
    value: "interestAmount",
    actionText: "interestsCollect",
    action: "collectInterests"
  },
  depositCollected: {
    title: "depositCollected",
    icon: "mdi-cloud-download",
    color: "red",
    value: "depositCollected",
    actionText: "depositCollect",
    action: "collectDeposit"
  },
  interestsCollected: {
    title: "interestsCollected",
    icon: "mdi-chart-sankey-variant",
    color: "orange",
    value: "interestsCollected",
    actionText: (context, readonly = false): any => {
      const user = context.$auth.user

      return user.role === UserRoles.CLIENTE && !readonly ? "movementsList" : null
    },
    action: (context, readonly = false): any => {
      const user = context.$auth.user

      return user.role === UserRoles.CLIENTE && !readonly ? "showMovementsList" : null
    }
  },
  monthCommissions: {
    title: "monthCommissions",
    icon: "mdi-wallet",
    color: "green",
    value: "monthCommissions",
    actionText: (context, readonly = false) => {
      const user = context.$auth.user

      const isReferenceAgent = user.hasSubAgents && !user.referenceAgent
      const userIsAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(context.$auth.user.role)

      if (readonly) {
        return isReferenceAgent || userIsAdmin ? "addCommissions" : ""
      }

      return "collectCommissions"
    },
    action: (context, readonly = false): any => {
      const user = context.$auth.user

      const isReferenceAgent = user.hasSubAgents && !user.referenceAgent
      const userIsAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(context.$auth.user.role)

      if (readonly) {
        return isReferenceAgent || userIsAdmin ? "addCommissions" : null
      }

      return "collectCommissions"
    }
  },
  reinvestedCommissions: {
    title: "reinvestedCommissions",
    icon: "mdi-wallet",
    color: "orange",
    value: "reinvestedCommissions",
    // actionText: "reinvestedCommissions",
    // action: "collectInterests"
  },
  collectedCommissions: {
    title: "collectedCommissions",
    icon: "mdi-wallet",
    color: "red",
    value: "collectedCommissions",
    // actionText: "collectedCommissions",
    // action: "collectInterests"
  },
  clientsTotalDeposit: {
    title: "clientsTotalDeposit",
    icon: "mdi-wallet",
    color: "green",
    value: "clientsTotalDeposit",
    // actionText: "collectedCommissions",
    // action: "collectInterests"
  },
  draft: {
    title: "draft",
    icon: "mdi-account-outline",
    color: getAccountStatusColor("draft"),
    value: "draft",
  },
  pendingSignature: {
    title: "pendingSignature",
    icon: "mdi-account-edit",
    color: getAccountStatusColor("validated"),
    value: "pendingSignature",
  },
  pendingFirstAccess: {
    title: "pendingFirstAccess",
    icon: "mdi-account-arrow-right",
    color: getAccountStatusColor("approved"),
    value: "pendingFirstAccess",
  },
  active: {
    title: "active",
    icon: "mdi-account-check",
    color: getAccountStatusColor("active"),
    value: "active",
  },

}


export default data
