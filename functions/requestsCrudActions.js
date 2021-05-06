import moment from "moment";
import jsFileDownload from "js-file-download";

/**
 *
 * @param {*} request
 * @param {{}} param1
 * @param {any} [emit]
 * @param {import("../@types/AlertsPlugin").AlertsPlugin} param1.$alerts
 */
export default function (request, {$apiCalls, $alerts, $options, $enums, $i18n, $moment, $emit}, emit) {
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
      return false
    }
  }

  async function approve(requestData, emitCallback) {
    if ([$enums.RequestTypes.VERSAMENTO, $enums.RequestTypes.RISC_CAPITALE].includes(requestData.type)
      && requestData.status === $enums.RequestStatus.NUOVA) {

      if (emitCallback) {
        return emitCallback()
      }

      return $emit("requestStartWorking", requestData);
    }

    const currentRequest = request.value ?? request

    try {
      const alertData = {
        type: $i18n.t("enums.RequestTypes." + $enums.RequestTypes.get(currentRequest.type).id),
        amount: $enums.CurrencyType.get(currentRequest.currency).symbol
          + " "
          + $options.filters.moneyFormatter(currentRequest.amount),
        user: $options.filters.userFormatter(currentRequest.user)
      }
      await $alerts.askBeforeAction({
        key: "approve-request",
        preConfirm: async (value) => {
          const amountInput = document.getElementById("req_amountChange")
          const amount = +amountInput.cleave.getRawValue()

          await $apiCalls.acceptRequest(currentRequest, moment(value, "DD/MM/YYYY", true).toDate(), amount);
        },
        settings: {
          html: $i18n.t(`alerts.approve-request-text`, alertData) +
            `<input id="req_amountChange" class="swal2-input" placeholder="Importo" value="${$options.filters.moneyFormatter(currentRequest.amount)}">`,
          focusConfirm: false,
          onOpen: (htmlElement) => {
            const inputAmount = htmlElement.querySelector("#req_amountChange");

            inputAmount.cleave = new Cleave(inputAmount, {
              numeral: true,
              delimiter: '.',
              numeralPositiveOnly: true,
              numeralDecimalMark: ',',
              numeralDecimalScale: 2
            })

            inputAmount.addEventListener("keydown", function (e) {
              if (e.key === ".") {
                e.preventDefault()

                if (!e.target.value.includes(",")) {
                  e.target.value += ","
                }
              }
            })
            inputAmount.addEventListener("blur", function (e) {
              /** @type  {string} */
              let value = e.target.value
              const selectionStart = inputAmount.selectionStart

              if (value === "") {
                value = "0,00"
              }

              if (!value.includes(",")) {
                value += ",";
              }

              let decimals = value.slice(value.indexOf(","))

              while (decimals.length <= 2) {
                value += "0";

                decimals = value.slice(value.indexOf(","));
              }

              if (value !== e.target.value) {
                inputAmount.value = value;
              }
            })
          },

          input: "text",
          inputValue: $moment().format("DD/MM/YYYY"),
          inputPlaceholder: $i18n.t("forms.payment-doc-date"),
          inputValidator: (value, a, b) => {
            if (!value) {
              return $i18n.t("validators.required")
            }

            const incomingDate = moment(value, "DD/MM/YYYY", true)

            if (!incomingDate.isValid()) {
              return $i18n.t("validators.date")
            }

            const minMonthDate = moment().subtract(1, "months")
              .set({
                'date': 1,
                'hour': 0,
                "minute": 0,
                "second": 0,
                "millisecond": 0
              })

            // Assure that the date is not older then 1st of previous month
            if ((minMonthDate.isAfter(incomingDate))) {
              return $i18n.t("validators.dateToOld")
            }

            const minCurrentMonthDate = moment().set({
              'date': 1,
              'hour': 0,
              "minute": 0,
              "second": 0,
              "millisecond": 0
            })
            /*
            If the current date is > 15, and the date refers to the precious month,
            then it means that the recapitalization has
            already occurred and also the agents commission calculation, so we can't add
            a movement on the previous month.
             */
            if (moment().date() > 15 && minCurrentMonthDate.isAfter(incomingDate)) {
              return $i18n.t("validators.dateBeforeRecapitalization")
            }
          }
        },
        data: alertData
      });

      return true
    } catch (er) {
      $alerts.error(er)

      return false
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
      return false
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
      return false
    }
  }

  async function cancelAutoWithdrawlAll() {
    const currentRequest = request.value ?? request

    try {
      await $alerts.askBeforeAction({
        key: "cancel-auto-withdrawl-request",
        preConfirm: async () => {
          await $apiCalls.cancelRequest({
            id: currentRequest.id,
            reason: "cancelled by user"
          });
        },
        settings: {
          confirmButtonColor: "red",
        },
        data: {
          type: $i18n.t(
            "enums.RequestTypes." +
            $enums.RequestTypes.get(currentRequest.type).id
          ),
        }
      });

      return true
    } catch (er) {
      $alerts.error(er)
      return false
    }
  }

  async function downloadReceipt(reqId) {
    try {
      const result = await $apiCalls.downloadRequestReceipt(reqId)

      jsFileDownload(result.data, result.headers["x-file-name"]);
      return true
    } catch (er) {
      $alerts.error(er)
      return false
    }
  }

  return {
    delete: deleteFn,
    approve,
    reject,
    cancel,
    cancelAutoWithdrawlAll,
    downloadReceipt
  }
}
