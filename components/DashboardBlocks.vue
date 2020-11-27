<template>
  <v-row class="">
    <v-col v-for="block of blocksList" :key="block.id" md="3" sm="6">
      <v-card class="flex-fill flex-row d-flex align-start">
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
            {{ $t(`pages.dashboard.${block.title}`) }}
          </v-card-text>

          <v-card-actions class="text-right pt-0 transparent">
            <v-btn link text small color="primary" @click="block.action">
              {{ $t(`pages.dashboard.${block.actionText}`) }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import { get as _get } from "lodash";

import DashboardBlocksList from "../config/blocks/dashboardBlocks";
import RoleBasedConfig from "../config/roleBasedConfig";
import UserRoles from "../enums/UserRoles";

export default {
  name: "DashboardBlocks",
  props: {
    dashboardData: {
      type: Object,
      required: true
    }
  },
  setup(props, { root }) {
    const { $auth, $router } = root;
    const blocksActions = {
      addDeposit() {
        $router.push("/requests?new=add_deposit");
      },
      showMovementsList() {
        $router.push("/movements");
      },
      collectDeposit() {
        $router.push("/requests?new=collect_deposit");
      },
      collectInterests() {
        $router.push("/requests?new=collect_interests");
      }
    };

    const blocksList = computed(() => {
      const userRole = +$auth.user.role;
      const roleName = UserRoles.getIdName(userRole);

      const blocks = _get(
        RoleBasedConfig,
        `${roleName}.blocks.dashboard.blocks`
      );

      if (!blocks) {
        console.warn("Can't find config for " + roleName);
      }

      return blocks.reduce((acc, _block) => {
        const blockObj = DashboardBlocksList[_block];

        acc.push({
          ...blockObj,
          id: _block,
          action: blocksActions[blockObj.action]
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
