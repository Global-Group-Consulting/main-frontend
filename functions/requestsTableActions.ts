import Vue from "vue";
import {contractNumberFormatter, dateFormatter, moneyFormatter, userFormatter} from "~/plugins/filters";
import {RequestFormData} from "~/@types/Requests";
import RequestTypes from "~/enums/RequestTypes";
import CurrencyType from "~/enums/CurrencyType";
import jsFileDownload from "js-file-download";
import moment from "moment";
import {HTMLInputCleave, HTMLInputCurrency} from "~/functions/classes/HTMLInputCurrency";
import MessageTypes from "~/enums/MessageTypes";


export class RequestsTableActions {
  private ctx: Vue

  constructor(ctx: Vue) {
    this.ctx = ctx
  }

  get userIsAdmin() {
    return this.ctx.$store.getters["user/userIsAdmin"]
  }

  async openDetailsDialog(row: RequestFormData) {
    let title = this.ctx.$t("dialogs.requests.title-details");

    if (this.userIsAdmin && row.user) {
      title += ` <small><em>(${userFormatter(row.user)} - ${contractNumberFormatter(row.user.contractNumber)})</em></small>`;
    }

    await this.ctx.$store.dispatch("dialog/updateStatus", {
      title,
      id: "RequestDialog",
      readonly: true,
      data: {
        id: row.id
      }
    });
  }

  /**
   * Prende in carico una richiesta
   */
  async takeCharge(request: RequestFormData) {
    await this.ctx.$store.dispatch("dialog/updateStatus", {
      id: "CommunicationNewDialog",
      title: this.ctx.$t(`dialogs.communicationNewDialog.title-conversation`),
      fullscreen: false,
      readonly: false,
      data: {
        type: MessageTypes.CONVERSATION,
        subject: this.ctx.$t(
          `dialogs.communicationNewDialog.subject-new-${request.type === RequestTypes.RISC_CAPITALE ? "withdrawl" : "deposit"}`,
          {date: dateFormatter(request.created_at)}
        ),
        receiver: request.user.id,
        message: this.ctx.$t(
          `dialogs.communicationNewDialog.message-new-${request.type === RequestTypes.RISC_CAPITALE ? "withdrawl" : "deposit"}`,
          {
            firstName: request.user.firstName,
            lastName: request.user.lastName,
            amount: moneyFormatter(request.amount)
          }
        ),
        request
      }
    });

    /*return this.ctx.$emit("requestStartWorking", request);*/
  }

  /**
   * Approva subito una richiesta
   */
  async approve(request: RequestFormData): Promise<boolean> {
    if (!request) {
      throw new Error("Missing request argument");
    }
    const currentRequest = request

    try {
      const alertData = {
        type: this.ctx.$t("enums.RequestTypes." + RequestTypes.get(currentRequest.type).id),
        amount: CurrencyType.get(currentRequest.currency).symbol + " " + moneyFormatter(currentRequest.amount),
        user: userFormatter(currentRequest.user)
      }

      // default inputs for approve modal.
      // allow to change the req. amount
      const inputs = [`<label for="req_amountChange" class="swal2-input-label">Importo</label>
                       <input id="req_amountChange" class="swal2-input" placeholder="Importo"
                              value="${moneyFormatter(currentRequest.amount)}">`];

      // If the req type is VERSAMENTO adds a new field
      // for specifying the amount in gold.
      if (currentRequest.type === RequestTypes.VERSAMENTO) {
        inputs.push(`<label for="req_goldAmountChange" class="swal2-input-label">Grammi oro</label>
                     <input id="req_goldAmountChange" class="swal2-input" placeholder="Grammi oro"
                            value="${currentRequest.goldAmount || 0}">`)
      }

      // Adds a field for specifying the date of the req. date.
      inputs.push(`<label for="req_goldAmountChange" class="swal2-input-label">Data contabile</label>`)

      await this.ctx.$alerts.askBeforeAction({
        key: "approve-request",
        preConfirm: async (value: string) => {
          const amountInput: HTMLInputCleave = document.getElementById("req_amountChange") as HTMLInputCleave
          const goldAmountInput: HTMLInputCleave = document.getElementById("req_goldAmountChange") as HTMLInputCleave

          const amount = +amountInput?.cleave?.getRawValue();
          const goldAmount = +goldAmountInput?.cleave?.getRawValue();

          await this.ctx.$apiCalls.acceptRequest(currentRequest,
            moment(value, "DD/MM/YYYY", true).toDate(),
            amount, goldAmount);

          await this.ctx.$store.dispatch("requests/fetchData");
        },
        settings: {
          html: this.ctx.$t(`alerts.approve-request-text`, alertData) + `<br>${inputs.join("")}`,
          focusConfirm: false,
          onOpen: (htmlElement) => {
            const inputAmount = htmlElement.querySelector("#req_amountChange") as HTMLInputElement;
            const inputGoldAmount = htmlElement.querySelector("#req_goldAmountChange") as HTMLInputElement;

            inputAmount && new HTMLInputCurrency(inputAmount);
            inputGoldAmount && new HTMLInputCurrency(inputGoldAmount);
          },
          input: "text",
          inputValue: moment().format("DD/MM/YYYY"),
          inputPlaceholder: this.ctx.$t("forms.payment-doc-date") as string,
          inputValidator: (value: string) => {
            if (!value) {
              return this.ctx.$t("validators.required") as string
            }

            const incomingDate = moment(value, "DD/MM/YYYY", true);
            const minMonthDate = moment().subtract(1, "months").set({
              'date': 1,
              'hour': 0,
              "minute": 0,
              "second": 0,
              "millisecond": 0
            });
            const minCurrentMonthDate = moment().set({
              'date': 1,
              'hour': 0,
              "minute": 0,
              "second": 0,
              "millisecond": 0
            })

            if (!incomingDate.isValid()) {
              return this.ctx.$t("validators.date") as string
            }

            // Assure that the date is not older then 1st of previous month
            if ((minMonthDate.isAfter(incomingDate))) {
              return this.ctx.$t("validators.dateToOld") as string
            }

            /*
            If the current date is > 15, and the date refers to the precious month,
            then it means that the recapitalization has
            already occurred and also the agents commission calculation, so we can't add
            a movement on the previous month.
             */
            if (moment().date() > 15 && minCurrentMonthDate.isAfter(incomingDate)) {
              return this.ctx.$t("validators.dateBeforeRecapitalization") as string
            }

            return "";
          }
        },
        data: alertData
      });

      return true
    } catch (er) {
      this.ctx.$alerts.error(er)

      return false
    }
  }

  /**
   * Rifiuta subito una richiesta
   */
  async reject(request: RequestFormData): Promise<boolean> {
    if (!request) {
      throw new Error("Missing request argument");
    }

    const currentRequest = request

    try {
      await this.ctx.$alerts.askBeforeAction({
        key: "reject-request",
        preConfirm: async (value: string) => {
          await this.ctx.$apiCalls.rejectRequest({
            id: currentRequest.id,
            reason: value
          });

          await this.ctx.$store.dispatch("requests/fetchData");
        },
        settings: {
          confirmButtonColor: "red",
          input: "textarea",
          inputValue: "",
          inputValidator: (value: string) => {
            if (value) {
              return null
            } else {
              return this.ctx.$t("validators.requiredMotivation") as string
            }
          }
        },
        data: {
          type: this.ctx.$t("enums.RequestTypes." + RequestTypes.get(currentRequest.type).id),
          amount: CurrencyType.get(currentRequest.currency).symbol + " " + moneyFormatter(currentRequest.amount),
          user: userFormatter(currentRequest.user)
        }
      });

      return true
    } catch (er) {
      this.ctx.$alerts.error(er)

      return false
    }
  }

  /**
   * Annulla una richiesta appena fatta prima finchè  questa non è in lavorazione.
   */
  async cancel(request: RequestFormData): Promise<boolean> {
    if (!request) {
      throw new Error("Missing request argument");
    }

    const currentRequest = request

    try {
      await this.ctx.$alerts.askBeforeAction({
        key: "cancel-request",
        preConfirm: async (value: string) => {
          await this.ctx.$apiCalls.cancelRequest({
            id: currentRequest.id,
            reason: value
          });

          await this.ctx.$store.dispatch("requests/fetchData");
        },
        settings: {
          confirmButtonColor: "red",
          input: "textarea",
          inputValue: "",
          inputValidator: (value: string) => {
            return value ? null : this.ctx.$t("validators.requiredMotivationCancel") as string
          }
        },
        data: {
          type: this.ctx.$t("enums.RequestTypes." + RequestTypes.get(currentRequest.type).id),
          amount: CurrencyType.get(currentRequest.currency).symbol + " " + moneyFormatter(currentRequest.amount),
        }
      });

      return true
    } catch (er) {
      this.ctx.$alerts.error(er)

      return false
    }
  }

  /**
   * Cancella completamente una richiesta effettuata
   */
  async delete(request: RequestFormData): Promise<boolean> {
    if (!request) {
      throw new Error("Missing request argument");
    }

    const currentRequest = request

    try {
      await this.ctx.$alerts.askBeforeAction({
        key: "delete-request",
        preConfirm: async () => {
          await this.ctx.$apiCalls.deleteRequest(currentRequest);
          await this.ctx.$store.dispatch("requests/fetchData");
        },
        data: {
          type: this.ctx.$t("enums.RequestTypes." + RequestTypes.get(currentRequest.type).id),
          amount: CurrencyType.get(currentRequest.currency).symbol + " " + moneyFormatter(currentRequest.amount)
        }
      });

      return true
    } catch (er) {
      this.ctx.$alerts.error(er)

      return false
    }
  }

  /**
   * Scarica la ricevuta di quella richiesta
   */
  async downloadReceipt(requestId: string) {
    try {
      const result = await this.ctx.$apiCalls.downloadRequestReceipt(requestId, "request")

      jsFileDownload(result.data, result.headers["x-file-name"]);

      return true
    } catch (er) {
      this.ctx.$alerts.error(er)

      return false
    }
  }

  async cancelAutoWithdrawlAll(request: RequestFormData) {
    if (!request) {
      throw new Error("Missing request argument");
    }

    const currentRequest = request

    try {
      await this.ctx.$alerts.askBeforeAction({
        key: "cancel-auto-withdrawl-request",
        preConfirm: async () => {
          await this.ctx.$apiCalls.cancelRequest({
            id: currentRequest.id,
            reason: "cancelled by user"
          });
        },
        settings: {
          confirmButtonColor: "red",
        },
        data: {
          type: this.ctx.$t("enums.RequestTypes." + RequestTypes.get(currentRequest.type).id
          ),
        }
      });

      return true
    } catch (er) {
      this.ctx.$alerts.error(er)

      return false
    }
  }
}
