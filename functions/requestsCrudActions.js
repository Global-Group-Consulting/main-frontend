/**
 * 
 * @param {*} request 
 * @param {{}} param1 
 * @param {import("../@types/AlertsPlugin").AlertsPlugin} param1.$alerts 
 */
export default function (request, { $apiCalls, $alerts, $options, $enums, $i18n }) {
  async function deleteFn() {
    const currentRequest = request.value ?? request

    try {
      await $alerts.askBeforeAction({
        key: "delete-request",
        preConfirm: async () => {
          const result = await $apiCalls.deleteRequest(currentRequest);
        },
        data: {
          type: $i18n.t(
            "enums.RequestTypes." +
            $enums.RequestTypes.get(currentRequest.type).id
          ),
          amount:
            $enums.CurrencyType.get(currentRequest.currency).symbol +
            " " +
            $options.filters.moneyFormatter(currentRequest.amount)
        }
      });

      return true
    } catch (er) {
      $alerts.error(er)
    }
  }

  async function approve() {
    const currentRequest = request.value ?? request

    try {
      await $alerts.askBeforeAction({
        key: "approve-request",
        preConfirm: async () => {
          await $apiCalls.acceptRequest(currentRequest);
        },
        data: {
          type: $i18n.t(
            "enums.RequestTypes." +
            $enums.RequestTypes.get(currentRequest.type).id
          ),
          amount:
            $enums.CurrencyType.get(currentRequest.currency).symbol +
            " " +
            $options.filters.moneyFormatter(currentRequest.amount),
          user: $options.filters.userFormatter(currentRequest.user)
        }
      });

      return true
    } catch (er) {
      $alerts.error(er)
    }
  }

  async function reject() {
    const currentRequest = request.value ?? request

    try {
      await $alerts.askBeforeAction({
        key: "reject-request",
        preConfirm: async (value) => {
          await $apiCalls.rejectRequest({
            id: currentRequest.id,
            reason: value
          });
        },
        settings: {
          confirmButtonColor: "red",
          input: "textarea",
          inputValue: "",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve()
              } else {
                resolve($i18n.t("validators.requiredMotivation"))
              }
            })
          }
        },
        data: {
          type: $i18n.t(
            "enums.RequestTypes." +
            $enums.RequestTypes.get(currentRequest.type).id
          ),
          amount:
            $enums.CurrencyType.get(currentRequest.currency).symbol +
            " " +
            $options.filters.moneyFormatter(currentRequest.amount),
          user: $options.filters.userFormatter(currentRequest.user)
        }
      });

      return true
    } catch (er) {
      $alerts.error(er)
    }
  }

  async function cancel() {
    const currentRequest = request.value ?? request

    try {
      await $alerts.askBeforeAction({
        key: "cancel-request",
        preConfirm: async (value) => {
          await $apiCalls.cancelRequest({
            id: currentRequest.id,
            reason: value
          });
        },
        settings: {
          confirmButtonColor: "red",
          input: "textarea",
          inputValue: "",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve()
              } else {
                resolve($i18n.t("validators.requiredMotivationCancel"))
              }
            })
          }
        },
        data: {
          type: $i18n.t(
            "enums.RequestTypes." +
            $enums.RequestTypes.get(currentRequest.type).id
          ),
          amount:
            $enums.CurrencyType.get(currentRequest.currency).symbol +
            " " +
            $options.filters.moneyFormatter(currentRequest.amount),
        }
      });

      return true
    } catch (er) {
      $alerts.error(er)
    }
  }

  return {
    delete: deleteFn,
    approve,
    reject,
    cancel
  }
}