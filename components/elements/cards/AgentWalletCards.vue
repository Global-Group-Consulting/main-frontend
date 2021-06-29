<template>
  <v-row class="mb-10">
    <v-col v-for="(card, i) of dashboardBlocks" :key="'card_' + i"
           cols="12" sm="6" lg="3">
      <dashboard-card :card-data="card"/>
    </v-col>
  </v-row>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {DynamicTab} from "~/@types/components/DynamicTab";
import UserRoles from "~/enums/UserRoles";
import {BlockData} from "~/config/blocks/dashboardBlocks";

@Component
export default class AgentWalletCards extends Vue {
  @Prop({type: String})
  userId!: string

  loading: boolean = true;


  dashboardData: any = {
    blocks: {
      monthCommissions: 0,
      reinvestedCommissions: 0,
      collectedCommissions: 0,
      clientsTotalDeposit: 0,
      agentBritesTotal: 0,
      agentBritesCurrMonth: 0,
    }
  }

  get monthCommissionsActionText(): string {
    const user = this.$auth.user

    const isReferenceAgent = user.hasSubAgents && !user.referenceAgent
    const userIsAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(this.$auth.user.role)

    /*if (readonly) {
      return isReferenceAgent || userIsAdmin ? "addCommissions" : ""
    }*/

    return this.$t("pages.wallet.collectCommissions") as string
  }

  get dashboardBlocks(): BlockData[] {
    return [
      {
        title: this.$t("pages.wallet.monthCommissions") as string,
        icon: "mdi-wallet",
        color: "green",
        value: this.dashboardData.blocks.monthCommissions,
        actionText: this.monthCommissionsActionText,
        action: (context, readonly = false): any => {
          const user = this.$auth.user

          const isReferenceAgent = user.hasSubAgents && !user.referenceAgent
          const userIsAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(this.$auth.user.role)

          if (readonly) {
            return isReferenceAgent || userIsAdmin ? this.addCommissions() : null
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
          cardData.value = this.dashboardData.blocks[newTab];
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
        value: this.dashboardData.blocks.agentBritesTotal
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
      const result = await this.$apiCalls.fetchCommissionsStatus();
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

}
</script>
