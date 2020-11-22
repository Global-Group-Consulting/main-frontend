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
  }
}