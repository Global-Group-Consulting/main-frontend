<template>
  <div>
    <v-row v-for="(row, rowKey) of rows" :key="'row_' + rowKey">
      <v-col v-for="(col, colKey) of row" :key="'col_' + colKey" cols="12" sm="6" lg="4">

        <single-card :value="col" :filter="dashboardDataFilters[col.id]"></single-card>

      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SingleCard from "~/components/elements/cards/SingleCard.vue";
import {LargeCard} from "~/components/elements/cards/Cards";
import {moneyFormatter} from "~/plugins/filters/moneyFormatter";
import AccountStatuses from "~/enums/AccountStatuses";
import {BlockData} from "~/config/blocks/dashboardBlocks";
import {MenuListItem} from "~/@types/components/MenuListItem";

@Component({
  components: {SingleCard}
})
export default class AdminCards extends Vue {
  public dashboardData = {
    validatedUsers: [],
    pendingRequests: [],
    pendingSignatures: [],
    systemTotals: {
      deposit: 0,
      interests: 0,
      withdrewDeposit: 0,
      withdrewInterests: 0,
      withdrewInterestsClub: 0
    },
    commissionTotals: {
      total: 0,
      withdrew: 0,
      reinvested: 0,
    },
    newUsers: {
      thisMonth: 0,
      last3Months: 0,
      last6Months: 0,
      last12Months: 0,
    },
    usersStatus: {
      draft: 0,
      active: 0,
      pendingAccess: 0,
      pendingSignature: 0,
      suspended: 0
    },
    agentsNewUsers: [],
    agentsTotalEarnings: []
  }

  private dashboardDataFilters: Record<string, string> = {
    agentsNewUsers: "thisMonth",
    agentsTotalEarnings: "thisMonth",
  }

  get rows(): LargeCard[][] {
    return [
      [
        // col 1
        {
          id: "systemTotals",
          title: "Entrate / Uscite",
          items: [
            {
              title: "Deposito",
              value: "€ " + moneyFormatter(this.dashboardData.systemTotals.deposit),
              icon: "mdi-cloud-upload",
              color: "blue"
            }, {
              title: "Rendite",
              value: "€ " + moneyFormatter(this.dashboardData.systemTotals.interests),
              icon: "mdi-chart-timeline-variant",
              color: "green",
            }, {
              title: "Rendite riscosse (Classic) ",
              value: "€ " + moneyFormatter(this.dashboardData.systemTotals.withdrewInterests),
              icon: "mdi-chart-sankey-variant",
              color: "orange",
            },
            {
              title: "Rendite riscosse (GOLD)",
              value: "€ " + moneyFormatter(this.dashboardData.systemTotals.withdrewInterestsClub),
              icon: "mdi-diamond-stone",
              color: "#d4973b",
            }, {
              title: "Deposito prelevato",
              value: "€ " + moneyFormatter(this.dashboardData.systemTotals.withdrewDeposit),
              icon: "mdi-cloud-download",
              color: "red",
            },
          ]
        },

        // col 2
        {
          id: "usersStatus",
          title: "Stato Utenti",
          items: [
            {
              title: "Attivi",
              value: this.dashboardData.usersStatus.active.toString(),
              icon: "mdi-account-check",
              color: this.getAccountStatusColor(AccountStatuses.ACTIVE)
            }, {
              title: "Attesa accesso",
              value: this.dashboardData.usersStatus.pendingAccess.toString(),
              icon: "mdi-account-arrow-right",
              color: this.getAccountStatusColor(AccountStatuses.APPROVED),
            }, {
              title: "Attesa firma contratto",
              value: this.dashboardData.usersStatus.pendingSignature.toString(),
              icon: "mdi-account-edit",
              color: "#c2b441",
            }, {
              title: "Sospesi",
              value: this.dashboardData.usersStatus.suspended.toString(),
              icon: "mdi-account-off",
              color: "red",
            }, {
              title: "Bozza",
              value: this.dashboardData.usersStatus.draft.toString(),
              icon: "mdi-account-outline",
              color: this.getAccountStatusColor(AccountStatuses.DRAFT),
            }
          ]
        },

        // col 3,
        {
          id: "commissionsTotals",
          title: "Provvigioni",
          items: [
            {
              title: "Totali",
              value: "€ " + moneyFormatter(this.dashboardData.commissionTotals.total),
              icon: "mdi-cash-multiple",
              color: "primary"
            }, {
              title: "Riscosse",
              value: "€ " + moneyFormatter(this.dashboardData.commissionTotals.withdrew),
              icon: "mdi-cash-minus",
              color: "red"
            }, {
              title: "Reinvestite",
              value: "€ " + moneyFormatter(this.dashboardData.commissionTotals.reinvested),
              icon: "mdi-cash-refund",
              color: "orange"
            }
          ]
        },

        /*
        qui mostriamo solo i contatori degli utenti, e aggiungiamo un pulsabte che se cliccato
        mostra un popup con il nome di questi utenti, cliccabili che rimanda a anagrafica o profilo*/
        {
          id: "newUsers",
          title: "Nuovi Utenti",
          type: "inline",
          items: [
            {
              title: this.$t("filters.thisMonth") as string,
              textIcon: "MC",
              value: this.dashboardData.newUsers.thisMonth.toString(),
            }, {
              title: this.$t("filters.last3Months") as string,
              textIcon: "U3",
              value: this.dashboardData.newUsers.last3Months.toString(),
            }, {
              title: this.$t("filters.last6Months") as string,
              textIcon: "U6",
              value: this.dashboardData.newUsers.last6Months.toString(),
            }, {
              title: this.$t("filters.last12Months") as string,
              textIcon: "U12",
              value: this.dashboardData.newUsers.last12Months.toString(),
            }
          ]
        },


        /*Classifica agenti con nuovi Clineti
        se Un cliente non ha agente, associarlo ad un nome generico "Global Group (Senza Agente)"*/
        {
          id: "agentsNewUsers",
          title: "Nuovi utenti per agente",
          menu: (card: LargeCard) => this.getMenuActions(card),
          items: this.dashboardData.agentsNewUsers.reduce<BlockData[]>((acc, curr: any) => {
            acc.push({
              title: curr.agent.firstName + " " + curr.agent.lastName,
              value: curr.users[this.dashboardDataFilters.agentsNewUsers] || 0,
              textIcon: curr.agent.firstName.slice(0, 1) + curr.agent.lastName.slice(0, 1),
            })

            return acc
          }, [])
        },

        /*Classifica agenti con totali versamenti dei Clienti
        Tutti i versamenti, non solo iniziali. basandosi sempre sul periodo nel quale è sotto quel determinato agente.
        */
        //https://preview.keenthemes.com/metronic/vue/demo1/#/dashboard
        {
          id: "agentsTotalEarnings",
          title: "Nuovi Versam. per agente",
          menu: (card: LargeCard) => this.getMenuActions(card),
          items: this.dashboardData.agentsTotalEarnings
            .reduce<BlockData[]>((acc, curr: any, currIndex) => {
              acc.push({
                title: curr.agent.firstName + " " + curr.agent.lastName,
                rawValue: curr.totals[this.dashboardDataFilters.agentsTotalEarnings] || 0,
                value: "€ " + moneyFormatter(curr.totals[this.dashboardDataFilters.agentsTotalEarnings] || 0),
                textIcon: curr.agent.firstName.slice(0, 1) + curr.agent.lastName.slice(0, 1),
              })

              return acc
            }, [])
            .sort((el1, el2) => {
              return +el2.rawValue - +el1.rawValue
            })
        }
      ]
    ]
  }

  getMenuActions(item: LargeCard): MenuListItem[] {
    return [
      {
        value: "Questo mese",
        action: () => this.dashboardDataFilters[item.id] = "thisMonth",
      }, {
        value: "Ultimi 3 mesi",
        action: () => this.dashboardDataFilters[item.id] = "last3Months",
      }, {
        value: "Ultimi 6 mesi",
        action: () => this.dashboardDataFilters[item.id] = "last6Months",
      }, {
        value: "Ultimi 12 mesi",
        action: () => this.dashboardDataFilters[item.id] = "last12Months",
      }
    ]
  }


  getAccountStatusColor(status: string) {
    return AccountStatuses.get(status).color || "#c1c1c1"
  }


  async mounted() {
    const result = await this.$apiCalls.dashboardFetch(undefined, {
      onlyStatistics: true
    });

    result.systemTotals && (this.dashboardData.systemTotals = result.systemTotals);
    result.commissionTotals && (this.dashboardData.commissionTotals = result.commissionTotals);
    result.usersStatus && (this.dashboardData.usersStatus = result.usersStatus);
    result.agentsNewUsers && (this.dashboardData.agentsNewUsers = result.agentsNewUsers);
    result.agentsTotalEarnings && (this.dashboardData.agentsTotalEarnings = result.agentsTotalEarnings);

    result.newUsers && (this.dashboardData.newUsers = result.newUsers);
  }
}
</script>

<style scoped>

</style>
