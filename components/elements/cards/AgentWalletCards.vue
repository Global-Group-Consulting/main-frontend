<template>
  <div>
    <v-row class="mb-10">
      <v-col v-for="(card, i) of dashboardBlocks" :key="'card_' + i"
             cols="12" sm="6" lg="3">
        <dashboard-card :card-data="card" :loading="loading"/>
      </v-col>
    </v-row>

    <commissions-add-dialog v-if="$store.getters['dialog/dialogId'] === 'CommissionsAddDialog'"/>
    <agent-brite-use-dialog v-if="$store.getters['dialog/dialogId'] === 'AgentBriteUseDialog'"/>
    <agent-brite-add-dialog v-if="$store.getters['dialog/dialogId'] === 'AgentBriteAddDialog'"/>
  </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {DynamicTab} from "~/@types/components/DynamicTab";
import UserRoles from "~/enums/UserRoles";
import {BlockData} from "~/config/blocks/dashboardBlocks";
import {moneyFormatter} from "~/plugins/filters";
import CommissionsAddDialog from "~/components/dialogs/CommissionsAddDialog.vue";
import DashboardCard from "~/components/dashboard/DashboardCard.vue";
import AgentBriteUseDialog from "~/components/dialogs/AgentBriteUseDialog.vue";
import AgentBriteAddDialog from "~/components/dialogs/AgentBriteAddDialog.vue";
import {User} from "~/@types/UserFormData";

@Component({
  components: {AgentBriteAddDialog, AgentBriteUseDialog, DashboardCard, CommissionsAddDialog}
})
export default class AgentWalletCards extends Vue {
  @Prop({type: String})
  userId!: string

  @Prop({type: Object})
  user!: User

  loading: boolean = true;
  dashboardData: any = {
    blocks: {
      monthCommissions: 0,
      reinvestedCommissions: 0,
      collectedCommissions: {
        total: 0,
        totalBrites: 0,
        totalEuro: 0,
      },
      clientsTotalDeposit: 0,
      agentBritesTotal: 0,
      agentBritesCurrMonth: 0,
    }
  }

  get userIsRefAgent() {
    return this.$auth.user.hasSubAgents
      && !this.$auth.user.referenceAgent
      && !!this.userId // if no userId is given i'm in the wallet page
  }

  get userIsAdmin() {
    return this.$store.getters["user/userIsAdmin"]
  }

  get monthCommissionsActionText(): string {
    let toReturn = "collectCommissions"

    if (this.userIsRefAgent || this.userIsAdmin) {
      toReturn = "addCommissions"
    }

    return this.$t("pages.wallet." + toReturn) as string
  }

  get britesTotalActionText(): string {
    let toReturn = ""

    if (this.userIsAdmin) {
      toReturn = "addBrites"
    } else if (!this.userIsRefAgent) {
      toReturn = "useBrites"
    }

    return toReturn ? this.$t("pages.wallet." + toReturn) as string : ""
  }

  get dashboardBlocks(): BlockData[] {
    return [
      {
        title: this.$t("pages.wallet.monthCommissions") as string,
        icon: "mdi-wallet",
        color: "green",
        value: this.dashboardData.blocks.monthCommissions,
        actionText: this.monthCommissionsActionText,
        action: (): any => {
          if (this.userIsRefAgent || this.userIsAdmin) {
            return this.addCommissions();
          }

          return this.collectCommissions();
        }
      },
      {
        slotId: "reinvestedCommissions",
        title: this.$t("pages.wallet.reinvestedCommissions") as string,
        icon: "mdi-wallet",
        color: "orange",
        value: this.dashboardData.blocks["reinvestedCommissions"],
        valueDetails: "",
        dropDown: {
          "reinvestedCommissions": {
            label: this.$t("pages.wallet.reinvestedCommissions")
          },
          "collectedCommissions": {
            label: this.$t("pages.wallet.collectedCommissions")
          }
        },
        onDropDownChange: (cardData: BlockData, newTab: string) => {
          cardData.title = this.$t("pages.wallet." + newTab) as string;
          cardData.color = newTab === "reinvestedCommissions" ? "orange" : "red";
          cardData.value = newTab === "collectedCommissions" ? this.dashboardData.blocks[newTab].total : this.dashboardData.blocks[newTab];
          cardData.valueDetails = newTab === "collectedCommissions" ? ` (
            €${moneyFormatter(this.dashboardData.blocks[newTab].totalEuro)} e Br'${moneyFormatter(this.dashboardData.blocks[newTab].totalBrite, true)}
            )` : "";
        }
      },
      {
        /*
        AZIONI
          - Utilizza: Solo AGENTI - Apre poupo che invia un messaggio per email. Questa deve essere cambiabiule lato settings.
          - Aggiungi: SOLO ADMIN - Chiedere importo e motivazione (Tipologia  AGGIUNTA)
          - Rimuovi: SOLO ADMIN - Chiedere importo e motivazione (Tipologia UTILIZZO)
        */

        slotId: "britesTotal",
        title: this.$t("pages.wallet.agentBritesTotal") as string,
        icon: "$brite",
        color: "gold",
        currency: "Br'",
        value: this.dashboardData.blocks.agentBritesTotal,
        actionText: this.britesTotalActionText,
        actionDisabled: !this.userIsAdmin && !this.dashboardData.blocks.agentBritesTotal,
        action: (): any => {
          if (this.userIsAdmin) {
            this.addBrites()
          } else if (!this.userIsRefAgent) {
            this.useBrites()
          }
        }
      },
      {
        slotId: "clientsTotalDeposit",
        title: this.$t("pages.wallet.clientsTotalDeposit") as string,
        icon: "mdi-wallet",
        color: "green",
        value: this.dashboardData.blocks.clientsTotalDeposit,
      }
    ]
  }

  async mounted() {
    try {
      const result = await this.$apiCalls.fetchCommissionsStatus(this.userId);
      const britesStats = await this.$apiCalls.agentBriteApi.statistics(this.userId);

      this.$set(this.dashboardData, "blocks", result.blocks);

      this.dashboardData.blocks.agentBritesTotal = britesStats["agentBritesTotal"];

    } catch (er) {
      this.$alerts.error(er)
    } finally {
      this.loading = false;
    }
  }

  addCommissions() {
    this.$store.dispatch("dialog/updateStatus", {
      id: "CommissionsAddDialog",
      title: this.$t("dialogs.commissionsAddDialog.title"),
      texts: {
        cancelBtn: "dialogs.commissionsAddDialog.btn-cancel",
        confirmBtn: "dialogs.commissionsAddDialog.btn-send"
      },
      data: {
        user: this.dashboardData.user
      }
    });
  }

  collectCommissions() {
    this.$router.push("/requests#new_collect_commissions");
  }

  addBrites() {
    const user = this.user

    if(!user){
      return
    }

    this.$store.dispatch("dialog/updateStatus", {
      id: "AgentBriteAddDialog",
      title: this.$t("dialogs.agentBriteAddDialog.title-add"),
      texts: {
        cancelBtn: "dialogs.agentBriteAddDialog.btn-cancel",
        confirmBtn: "dialogs.agentBriteAddDialog.btn-send"
      },
      data: {
        user,
        maxValue: this.dashboardData.blocks.agentBritesTotal
      }
    });
  }

  useBrites() {
    const user = this.dashboardData.user || this.$auth.user

    this.$store.dispatch("dialog/updateStatus", {
      id: "AgentBriteUseDialog",
      title: this.$t("dialogs.agentBriteUseDialog.title"),
      texts: {
        cancelBtn: "dialogs.agentBriteUseDialog.btn-cancel",
        //confirmBtn: "dialogs.commissionsAddDialog.btn-send"
      },
      data: {
        userName: user.firstName + " " + user.lastName,
        maxValue: this.dashboardData.blocks.agentBritesTotal
      }
    });
  }

}
</script>
