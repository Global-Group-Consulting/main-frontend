<template>
  <v-row class="">
    <v-col v-for="block of blocksList" :key="block.id" md="3" sm="6">
      <v-card class="flex-fill flex-row d-flex align-start" style="height: 100%">
        <v-icon x-large class="ml-3 mt-3" :color="block.color">
          {{ block.icon }}
        </v-icon>

        <div style="width: 100%">
          <v-card-title class="pb-0 text-no-wrap">
            €
            {{
              $options.filters.moneyFormatter(dashboardData.blocks[block.value])
            }}
          </v-card-title>
          <v-card-text>
            {{ $t(`pages.${page}.${block.title}`) }}
          </v-card-text>

          <v-card-actions class="text-right pt-0 transparent"
                          v-if="block.action">
            <v-btn link text small color="primary" @click="block.action">
              {{ $t(`pages.${page}.${block.actionText}`) }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {ref, computed} from "@vue/composition-api";
import {get as _get} from "lodash";

import DashboardBlocksList from "../config/blocks/dashboardBlocks.ts";
import RoleBasedConfig from "../config/roleBasedConfig";
import UserRoles from "../enums/UserRoles";

export default {
  name: "DashboardBlocks",
  props: {
    dashboardData: {
      type: Object,
      required: true
    },
    page: {
      default: "dashboard",
      type: String
    },
    readonly: Boolean
  },
  setup(props, {root}) {
    const {$auth, $router, $alerts} = root;
    const blocksActions = {
      addDeposit() {
        $router.push("/requests?new=add_deposit");
      },
      addCommissions() {
        $alerts.info({
          title: "",
          text: "Funzione presto disponibile!"
        })
      },
      showMovementsList() {
        $router.push("/movements");
      },
      collectDeposit() {
        $router.push("/requests?new=collect_deposit");
      },
      collectInterests() {
        $router.push("/requests?new=collect_interests");
      },
      collectCommissions() {
        $router.push("/requests?new=collect_commissions");
      }
    };

    const blocksList = computed(() => {
      const userRole = props.forRole || +$auth.user.role;
      const roleName = UserRoles.getIdName(userRole);

      const blocks = _get(
        RoleBasedConfig,
        `${roleName}.blocks.${props.page}.blocks`
      );

      if (!blocks) {
        console.warn("Can't find config for " + roleName)

        return []
      }

      return blocks.reduce((acc, _block) => {
        const blockObj = DashboardBlocksList[_block];
        let action
        let actionText

        if (typeof blockObj.action === "function") {
          action = blockObj.action(root, props.readonly)
        } else if (!props.readonly) {
          action = blockObj.action
        }

        if (typeof blockObj.actionText === "function") {
          actionText = blockObj.actionText(root, props.readonly)
        } else if (!props.readonly) {
          actionText = blockObj.actionText
        }

        acc.push({
          ...blockObj,
          id: _block,
          action: blocksActions[action],
          actionText
        });

        return acc;
      }, []);
    });

    return {
      blocksList
    };
  }
};
</script>

<style scoped></style>
