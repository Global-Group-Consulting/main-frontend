import UserRoles from "~/enums/UserRoles";
import AccountStatuses from "~/enums/AccountStatuses";

function getAccountStatusColor(status: string) {
  return AccountStatuses.get(status).color || "#c1c1c1"
}

export default {
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
    actionText: "movementsList",
    action: "showMovementsList"
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
    actionText: "interestsCollect",
    action: "collectInterests"
  },
  monthCommissions: {
    title: "monthCommissions",
    icon: "mdi-wallet",
    color: "green",
    value: "monthCommissions",
    actionText: (context: Vue, readonly = false) => {
      const user = context.$auth.user

      const isReferenceAgent = user.hasSubAgents && !user.referenceAgent
      const userIsAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(context.$auth.user.role)

      if (readonly) {
        return isReferenceAgent || userIsAdmin ? "addCommissions" : ""
      }

      return "collectCommissions"
    },
    action: (context: Vue, readonly = false) => {
      const user = context.$auth.user

      const isReferenceAgent = user.hasSubAgents && !user.referenceAgent
      const userIsAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(context.$auth.user.role)

      if (readonly) {
        return isReferenceAgent || userIsAdmin ? "addCommissions" : ""
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
