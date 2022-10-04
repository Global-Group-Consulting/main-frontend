<template>
  <v-row class="">
    <v-col v-for="(block, i) of blocksList" :key="block.id" md="3" sm="6">
      <v-card class="flex-fill flex-row d-flex align-start" style="height: 100%">
        <v-skeleton-loader :loading="loading"
                           class="flex-fill"
                           type="list-item-avatar-three-line"
        >
          <div class="flex-fill flex-row d-flex align-start">

            <v-icon x-large class="ml-3 mt-3" :color="block.color">
              {{ block.icon }}
            </v-icon>

            <div style="width: 100%">
              <v-card-title class="pb-0 text-no-wrap">
                <template v-if="!formatAsInt">
                  €
                  {{ $options.filters.moneyFormatter(dashboardData.blocks[block.value]) }}
                </template>
                <template v-else>
                  {{ dashboardData.blocks[block.value] }}
                </template>
              </v-card-title>

              <v-card-text>
                {{ $t(`pages.${page}.${block.title}`) }}
              </v-card-text>

              <slot :name="block.id +'_card-action'" v-bind:item="block">
                <v-card-actions class="text-right pt-0 transparent"
                                v-if="block.action">
                  <v-btn link text small color="primary" @click="block.action">
                    {{ $t(`pages.${page}.${block.actionText}`) }}
                  </v-btn>
                </v-card-actions>
              </slot>
            </div>
          </div>
        </v-skeleton-loader>
      </v-card>
    </v-col>

    <commissions-add-dialog
      v-if="includeCommissionsAddDialog && $store.getters['dialog/dialogId'] === 'CommissionsAddDialog'"/>
  </v-row>
</template>

<script lang="ts">
import {get as _get} from "lodash";

import DashboardBlocksList, {BlockAction, BlockData} from "../config/blocks/dashboardBlocks";
import roleBasedConfig from "../config/roleBasedConfig";
import UserRoles from "../enums/UserRoles";
import CommissionsAddDialog from "../components/dialogs/CommissionsAddDialog.vue";
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

type BlocksList = keyof typeof DashboardBlocksList

@Component({
  components: {CommissionsAddDialog: CommissionsAddDialog as any},
})
export default class DashboardBlocks extends Vue {
  @Prop({type: Object, required: true})
  dashboardData!: any

  @Prop({type: String, default: "dashboard"})
  page!: string

  @Prop({type: Boolean})
  formatAsInt!: boolean

  @Prop({type: Boolean})
  readonly!: boolean

  @Prop({type: Boolean})
  includeCommissionsAddDialog!: boolean

  @Prop({type: Boolean, default: true})
  loading!: boolean

  @Prop({type: String})
  forRole!: string

  get authUserIsRealAdmin() {
    return this.$store.getters["user/userIsRealAdmin"]
  }

  get userIsGold() {
    return this.dashboardData.user.gold
  }

  get blocksList() {
    const userRole = this.forRole || +this.$auth.user.role;
    const roleName: string = UserRoles.getIdName(userRole) as string;
    const colDefaultBlocks: BlocksList[] = _get(roleBasedConfig, `defaults.blocks.${this.page}.blocks`);

    let blocks: BlocksList[] = _get(roleBasedConfig, `${roleName}.blocks.${this.page}.blocks`, colDefaultBlocks);

    if (!blocks) {
      console.warn("Can't find config for " + roleName)

      return []
    }

    return blocks.reduce<Partial<BlockData> & { id: any, action: any, actionText: any }[]>((acc, _block) => {
      const blockObj: BlockData = DashboardBlocksList[_block];
      let action: BlockAction | null = null
      let actionText: string | null = null

      if (typeof blockObj.action === "function") {
        action = blockObj.action(this, this.readonly)
      } else if (!this.readonly) {
        action = blockObj.action as BlockAction
      }

      if (typeof blockObj.actionText === "function") {
        actionText = blockObj.actionText(this, this.readonly)
      } else if (!this.readonly) {
        actionText = blockObj.actionText as any
      }

      acc.push({
        ...blockObj,
        id: _block,
        action: action ? this.blocksActions[action] : null,
        actionText
      });

      return acc;
    }, []);
  }

  openAdminRequestDialog(request: any) {
    const reqText = this.$enums.RequestTypes.getIdName(request)
    const reqTranslation = this.$t("enums.RequestTypes." + reqText)

    this.$store.dispatch("dialog/updateStatus", {
      id: "AdminRequestDialog",
      title: this.$t("dialogs.adminRequestDialog.title", {request: reqTranslation}),
      texts: {
        cancelBtn: "dialogs.adminRequestDialog.btn-cancel",
        confirmBtn: "dialogs.adminRequestDialog.btn-send"
      },
      data: {
        user: this.dashboardData.user,
        type: request
      }
    });
  }

  blocksActions: Record<BlockAction, () => void> = {
    addDeposit: () => {
      if (this.authUserIsRealAdmin) {
        return this.openAdminRequestDialog(this.$enums.RequestTypes.VERSAMENTO)
      }

      this.$router.push("/requests#new_add_deposit");
    },
    addCommissions: () => {
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
    },
    showMovementsList: () => {
      this.$router.push("/movements");
    },
    collectDeposit: () => {
      if (this.authUserIsRealAdmin) {
        return this.openAdminRequestDialog(this.$enums.RequestTypes.RISC_CAPITALE)
      }

      this.$router.push("/requests#new_collect_deposit");
    },
    collectInterests: () => {
      if (this.authUserIsRealAdmin) {
        return this.openAdminRequestDialog(this.userIsGold ? this.$enums.RequestTypes.RISC_INTERESSI_BRITE : this.$enums.RequestTypes.RISC_INTERESSI)
      }

      this.$router.push("/requests#new_collect_interests");
    },
    collectCommissions: () => {
      this.$router.push("/requests#new_collect_commissions");
    },
  };

}
</script>

<style scoped></style>
