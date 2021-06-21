<template>
  <v-layout>
    <v-flex>
      <page-header
        page-name="requests"
      ></page-header>

      <page-toolbar :actions-list="actionsList" filters-schema="requests" always-visible
      ></page-toolbar>

      <dynamic-tabs :tabs-list="requestsTabs"
                    :loading="tableDataLoading"
                    :filters-fields-map="requestsFiltersFieldsMap"
                    filters-schema="requestsSchema"
                    filters-table-key="requestsFilter"
                    outlined
      >
        <template v-for="table of requestsTabs"
                  v-slot:[`tabContent_${table.id}`]="{item}">
          <requests-list-table
            :condition="table.id"
            :items="requestsGroups[table.id]"
            :loading="tableDataLoading"
            :sort-by="table.sortBy"
            :sort-desc="table.sortDesc"
            :multi-sort="table.multiSort"
            @click:row="openRequestDetails"
            @refetchData="onRefetchData"
            :items-per-page="25"
          ></requests-list-table>
        </template>
      </dynamic-tabs>
    </v-flex>

    <request-dialog
      @newRequestAdded="onNewRequestAdded"
      @requestDeleted="onRequestDeleted"
      @requestStatusChanged="onRequestStatusChanged"
      v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>

    <request-dialog-gold
      @newRequestAdded="onNewRequestAdded"
      @requestDeleted="onRequestDeleted"
      @requestStatusChanged="onRequestStatusChanged"
      v-if="$store.getters['dialog/dialogId'] === 'RequestDialogGold'"
    ></request-dialog-gold>

    <communication-new-dialog
      v-if="$store.getters['dialog/dialogId'] === 'CommunicationNewDialog'"
      @communicationAdded="onCommunicationAdded"
    ></communication-new-dialog>

  </v-layout>
</template>

<script lang="ts">
import {capitalize} from "lodash";
import jsFileDownload from "js-file-download";
import {Component, Vue, Watch} from "vue-property-decorator";

import RequestDialogGold from "~/components/dialogs/RequestGoldDialog.vue";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import RequestDialog from "~/components/dialogs/RequestDialog.vue";
import PageHeader from "~/components/blocks/PageHeader.vue";
import RequestsListTable from "~/components/table/RequestsListTable.vue";
import CommunicationNewDialog from "~/components/dialogs/CommunicationNewDialog.vue";

import {RequestsPermissions} from "~/functions/acl/enums/requests.permissions";
import permissionsFn from "~/functions/permissions";
import RequestTypes from "~/enums/RequestTypes";
import {contractNumberFormatter, dateFormatter, moneyFormatter, userFormatter} from "~/plugins/filters";
import {Moment} from "moment";
import {computed} from "@vue/composition-api";
import UserRoles from "~/enums/UserRoles";
import {DynamicTab} from "~/@types/components/DynamicTab";
import {ActionItem} from "~/@types/ActionItem";
import DynamicTabs from "~/components/DynamicTabs.vue";
import DataTable from "~/components/table/DataTable.vue";
import {requestsFiltersFieldsMap} from "~/config/forms/filters/requestsFiltersSchema";
import {RequestFormData} from "~/@types/Requests";

type RequestGroups = "nuova" | "lavorazione" | "accettata" | "rifiutata";

@Component({
  components: {
    DataTable,
    DynamicTabs,
    CommunicationNewDialog: CommunicationNewDialog as any,
    RequestDialog: RequestDialog as any,
    PageToolbar,
    RequestsListTable: RequestsListTable as any,
    RequestDialogGold: RequestDialogGold as any,
    PageHeader,
  },
  meta: {
    permissions: [RequestsPermissions.ACL_REQUESTS_ALL_READ, RequestsPermissions.ACL_REQUESTS_SELF_READ]
  },
})
export default class Requests extends Vue {
  public permissions = permissionsFn(this);
  public currentTab = 0

  get tableDataLoading() {
    return this.$store.getters["request/tableDataLoading"];
  }

  get requestsList(): RequestFormData[] {
    return this.$store.getters["requests/requestsList"]
  }

  get requestsGroups(): Record<RequestGroups, any[]> {
    return this.$store.getters["requests/requestsGroups"];
    /*const toReturn: any = {
      nuova: [],
      lavorazione: [],
      accettata: [],
      rifiutata: []
    };

    this.requestsList.forEach((richiesta: any) => {
      const stato = this.$enums.RequestStatus.get(richiesta.status);
      let groupName: string = stato.id;

      if (groupName === "annullata") {
        groupName = "accettata";
      }

      toReturn[groupName].push(richiesta);
    });

    return toReturn;*/
  }

  get requestsTabs(): DynamicTab[] {
    return [
      {
        id: "nuova",
        title: this.$t(`pages.requests.tableNuova-title`) as string + this.countTabData("nuova"),
        color: "blue",
        icon: "mdi-timer-sand",
        sortBy: ["created_at", "user"],
        sortDesc: [true]
      },
      {
        id: "lavorazione",
        title: this.$t(`pages.requests.tableLavorazione-title`) as string + this.countTabData("lavorazione"),
        color: "warning",
        icon: "mdi-sitemap",
        sortBy: ["updated_at", "created_at", "user"],
        sortDesc: [true]
      },
      {
        id: "accettata",
        title: this.$t(`pages.requests.tableAccettata-title`) as string + this.countTabData("accettata"),
        color: "green",
        icon: "mdi-check-all",
        sortBy: ["completed_at", "created_at", "user"],
        sortDesc: [true, false],
        multiSort: true
      },
      {
        id: "rifiutata",
        title: this.$t(`pages.requests.tableRifiutata-title`) as string + this.countTabData("rifiutata"),
        color: "red",
        icon: "mdi-close-box-multiple-outline",
        sortBy: ["completed_at", "created_at", "user"],
        sortDesc: [true, false],
        multiSort: true
      }
    ]
  }

  get requestsFiltersFieldsMap() {
    return requestsFiltersFieldsMap
  }

  get actionsList(): ActionItem[] {
    // Utente NON GOLD
    /*
    - riscuote interessi / rendite in maniera classica
    - preleva deposito tramite richiesta chat (come per il versamento)
    - può versare come succede ora
     */

    // Utente GOLD
    /*
    - riscuotere le rendite / interessi attraverso il dialog gold / club (o tramite brite o oro fisico)
        - usare lo stesso dialog del versamento ed il flusso deve essere lo stesso che per i versamenti. La richiesta quindi deve essere presa in carico e tramite chat si deve sviluppare.
    - preleva deposito tramite richiesta chat (come per il versamento)
    - può versare come succede ora
     */

    // Agente Gold o NON Gold
    /*
    - riscuotere le provvigioni come ora.
     */
    return [

      /*{
        title: this.$t("pages.requests.btnDeposit")
      },*/

      {
        text: "request-withdrawl-deposit",
        tooltip: "request-withdrawl-deposit-tooltip",
        icon: "mdi-bank-minus",
        click: () => this.newWithdrawlRequest(this.$enums.RequestTypes.RISC_CAPITALE),
        if: this.canWithdrawl,
        options: {
          color: "red"
        }
      },
      {
        text: "request-withdrawl-classic",
        tooltip: "request-withdrawl-classic-tooltip",
        icon: "mdi-cash-minus",
        click: () => this.newWithdrawlRequest(this.$enums.RequestTypes.RISC_INTERESSI),
        if: this.canRequestClassic,
        options: {
          color: "orange"
        }
      },
      {
        text: "request-withdrawl-club",
        tooltip: "request-withdrawl-club-tooltip",
        icon: "mdi-cash-minus",
        click: () => this.newWithdrawlRequestGold(this.$enums.RequestTypes.RISC_INTERESSI_BRITE),
        if: this.canRequestGold,
        options: {
          color: "orange"
        }
      },
      {
        text: "request-deposit-new",
        tooltip: "request-deposit-new-tooltip",
        icon: "mdi-cash-plus",
        click: this.newDepositRequest,
        if: this.canDeposit,
        options: {
          color: "green"
        }
      },

      {
        text: "request-download-report",
        // icon: "mdi-chevron-down",
        if: this.canDownloadReport,
        options: {
          color: "primary"
        },
        menuOptions: [
          {
            text: this.getLastMonth(0) as string,
            click: () => this.onDownloadReportClick(0)
          },
          {
            text: this.getLastMonth() as string,
            click: () => this.onDownloadReportClick()
          },
          {
            text: this.getLastMonth(2) as string,
            click: () => this.onDownloadReportClick(2)
          },
          {
            text: this.getLastMonth(3) as string,
            click: () => this.onDownloadReportClick(3)
          }
        ]
      }
    ]
  }

  get dialogState() {
    return this.$store.getters["dialog/dialogState"]
  }

  get userType(): "admin" | "user" {
    return [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+this.$auth.user.role) ? "admin" : "user"
  }

  get canWithdrawl() {
    return this.userType === "user"
  }

  get canRequestClassic() {
    return this.userType === "user" && !this.$auth.user.gold
  }

  get canRequestGold() {
    return this.userType === "user" && this.$auth.user.gold
  }

  get canDeposit() {
    return this.userType === "user"
  }

  get canDownloadReport() {
    return this.userType === "admin"
  }

  private countTabData(tabId: RequestGroups) {
    const toReturn = [];

    const dataLength = this.requestsGroups[tabId].length;

    if (dataLength) {
      toReturn.push(` (${dataLength})`);
    }

    return toReturn.join("")
  }

  private async fetchAll() {
    await this.$store.dispatch("requests/fetchData");
  }

  getRequestName(req: number | string) {
    return this.$enums.RequestStatus.getIdName(+req)
  }

  getLastMonth(months?: number, returnMoment = false): Moment | string {
    const now = this.$moment()
    let rightMonth = now.date() > 15 ? now : now.subtract(1, "months")

    if (months === 0) {
      rightMonth = now.add(1, "months")
    } else if (months) {
      rightMonth = now.subtract(months - 1, "months")
    }

    if (returnMoment) {
      return rightMonth
    }

    const prevMonth = this.$moment(rightMonth).subtract(1, "months")

    return capitalize(rightMonth.format("MMMM YYYY")) + ` (16 ${prevMonth.format("MMM")} - 15 ${rightMonth.format("MMM")})`
  }

  onRefetchData() {
    this.fetchAll();
  }

  onNewRequestAdded() {
    this.fetchAll();
  }

  onRequestDeleted() {
    this.fetchAll();
  }

  onRequestStatusChanged() {
    this.fetchAll();
  }

  onCommunicationAdded() {
    this.fetchAll();
  }

  async onDownloadReportClick(months?: number) {
    const rightMonth: Moment = this.getLastMonth(months, true) as Moment

    try {
      const file = await this.$apiCalls.downloadRequestsReport(rightMonth.format("YYYY-MM"))

      jsFileDownload(file.data, this.$t("pages.requests.fileReportName", {date: this.getLastMonth(months)}) + ".xlsx")
    } catch (er) {
      this.$alerts.error(er)
    }
  }

  newDepositRequest() {
    this.$store.dispatch("dialog/updateStatus", {
      title: this.$t("dialogs.requests.title-deposit"),
      id: "RequestDialog",
      data: {
        type: this.$enums.RequestTypes.VERSAMENTO
      }
    });
  }

  newWithdrawlRequest(type?: number) {
    const reqType = type || this.$enums.RequestTypes.RISC_INTERESSI

    /*

    Se essite una richiesta automatica però il messaggio non deve comparire
    perchè l'utente potrebbe voler richiedere altri tipi di riscossione o prelievi
    se NON è GOLD.
    In questo caso quindi la voce "richiesta provvigioni"  dovrebbe essere disabilitata

    Se è gold invece non può chiedere altri tipi se non quello dei gold

     */

    if (this.$auth.user.autoWithdrawlAll && this.$auth.user.gold) {
      this.$alerts.info({
        title: "",
        html: this.$t("alerts.autoWithdrawl-not-available", {link: "/requests#" + this.$auth.user.autoWithdrawlAll}) as string,
        onOpen: (el: HTMLElement) => {
          el.querySelector("a")?.addEventListener("click", () => {
            this.$alerts.close()
          })
        }
      })

      return
    }

    this.$store.dispatch("dialog/updateStatus", {
      title: this.$t("dialogs.requests.title-withdrawal-" + reqType),
      id: "RequestDialog",
      data: {
        type: reqType,
        gold: this.$auth.user.gold,
        clubPack: this.$auth.user.clubPack
      }
    });
  }

  newWithdrawlRequestGold(type?: number) {
    if (!this.checkWithdrawalPermissions()) {
      return
    }

    this.$store.dispatch("dialog/updateStatus", {
      title: this.$t("dialogs.requests.title-withdrawal-gold"),
      id: "RequestDialogGold",
      fullscreen: true,
      theme: "global-club",
      noActions: true,
      data: {
        type: type || this.$enums.RequestTypes.RISC_CAPITALE
      }
    });
  }

  /**
   * If the user si gold but doesn't have an active pack or the pack is "UNSUBSCRIBED",
   * won't let it make any withdrawl request except for hte commissions if an agent.
   */
  checkWithdrawalPermissions() {
    const userIsGold = this.$auth.user.gold;
    const userClubUnsubscribed = !this.$auth.user.clubPack || this.$auth.user.clubPack === this.$enums.ClubPacks.UNSUBSCRIBED;

    if (userIsGold && userClubUnsubscribed) {
      this.$alerts.info({
        title: "",
        html: this.$t("alerts.club-request-unsubscribed") as string
      })

      return false
    }

    return true
  }

  openRequestDetails(row: any) {
    let title = this.$t("dialogs.requests.title-details");

    if (this.permissions.userType === "admin" && row.user) {
      title += ` <small><em>(${userFormatter(row.user)} - ${contractNumberFormatter(row.user.contractNumber)})</em></small>`;
    }

    this.$store.dispatch("dialog/updateStatus", {
      title,
      id: "RequestDialog",
      readonly: true,
      data: {
        id: row.id
        /*...row,
        currency: +row.currency,
        status: +row.status,
        type: +row.type,
        wallet: +row.wallet*/
      }
    });
  }

  @Watch("$route.hash")
  onUrlHashChange() {
    const hash = window.location.hash.replace("#", "")

    if (!hash) {
      return
    }

    // new must contain the type of required request as "new_type_of_request"
    if (hash.startsWith("new")) {
      const newType = hash.slice(hash.indexOf("_") + 1)

      switch (newType) {
        case "add_deposit":
          this.newDepositRequest();
          break;
        case "collect_deposit":
        case "collect_interests":
        case "collect_commissions":
          let type = -1;

          if (newType === "collect_deposit") {
            /*if (!this.canRequestClassic && this.canRequestGold) {
              type = RequestTypes.RISC_INTERESSI_GOLD
            } else {*/
            type = RequestTypes.RISC_CAPITALE;
            // }
          } else if (newType === "collect_interests") {
            if (!this.canRequestClassic && this.canRequestGold) {
              type = RequestTypes.RISC_INTERESSI_BRITE
            } else {
              type = RequestTypes.RISC_INTERESSI;
            }
          } else if (newType === "collect_commissions") {
            type = RequestTypes.RISC_PROVVIGIONI;
          }

          if ([RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(type)) {
            this.newWithdrawlRequestGold(type)
          } else {
            this.newWithdrawlRequest(type);
          }

          break;
        case "collect_gold":
          this.newWithdrawlRequestGold()
          break;
      }
    } else {
      const request = this.requestsList.find((_req: any) => _req.id === hash);

      if (request) {
        this.openRequestDetails(request);
      }
    }
  }

  @Watch('dialogState')
  onDialogClose(value: boolean) {
    if (!value) {
      window.location.hash = ""
    }
  }

  @Watch("requestsList", {deep: true})
  onRequestsGroupsChange(value: any) {
    this.onUrlHashChange();
  }


  /*@Watch("requestsList")
  onRequestsListChange(value: any[]) {
    this.$store.dispatch("filters/updateDataToFilter", value)
  }*/

  async beforeMount() {
    await this.fetchAll();

    this.onUrlHashChange()
  }
}

</script>
