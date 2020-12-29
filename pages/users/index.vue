<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>


      <v-tabs v-model="currentTab" :color="getTabColor">
        <v-tab v-for="group of usersList" :key="group.id">
          {{ $t(`enums.UserRoles.${$enums.UserRoles.getIdName(group.id)}_plural`) }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentTab">
        <v-tab-item v-for="group of usersList" :key="group.id">
          <v-card>
            <data-table
              :condition="+group.id"
              :items="group.data"
              table-key="users"
              schema="usersSchema"
              light
            >
              <template v-slot:item.superAdmin="{ item }">
                <v-tooltip right v-if="item.superAdmin">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" class="d-inline-block"
                    >mdi-diamond-stone
                    </v-icon
                    >
                  </template>

                  <span>Super Admin</span>
                </v-tooltip>
              </template>

              <template v-slot:item.referenceAgent="{item}">
                <v-btn text v-if="item.referenceAgentData" small
                       target="_blank"
                       class="text-capitalize"
                       color="primary"
                       :href="'users/' + item.referenceAgent">
                  <v-icon small class="mr-2">mdi-open-in-new</v-icon>
                  {{ item.referenceAgentData.firstName }} {{ item.referenceAgentData.lastName }}
                </v-btn>
              </template>

              <template v-slot:item.account_status="{ item }">
                <v-chip
                  small
                  :color="$enums.AccountStatuses.get(item.account_status).color"
                >
                  {{
                    $t(
                      "enums.AccountStatuses." +
                      $enums.AccountStatuses.getIdName(item.account_status)
                    )
                  }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <users-crud-actions
                  :item="item"
                  @userDeleted="onUserDeleted(item, group)"
                />
              </template>

              <template v-slot:item.contractSignedAt="{item}">
                <div v-if="item.contractSignedAt">
                  <template v-if="!item.contractImported">


                    <v-menu offset-y open-on-hover left>
                      <template v-slot:activator="{ on, attrs }">
                        <a v-on="on" v-bind="attrs" class="text-decoration-underline-dotted">
                          {{ $t("tables.contract-signed") }}
                        </a>
                      </template>

                      <signing-logs-popup :value="item.signinLogs || []"></signing-logs-popup>
                    </v-menu>
                  </template>

                  <template v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{on}">
                        <a v-on="on" class="text-decoration-underline-dotted">
                          {{ $t("tables.contract-imported") }}
                        </a>
                      </template>
                      <span>{{
                          $t("tables.contract-imported-at", {date: $options.filters.dateHourFormatter(item.contractSignedAt)})
                        }}</span>
                    </v-tooltip>
                  </template>
                </div>

                <div v-else class="red--text">
                  {{ $t("tables.contract-not-signed") }}
                </div>
              </template>
            </data-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>


      <v-row>
        <!--        <v-col cols="12" v-for="(group, key) in usersGroups" :key="key">
                  <v-card dark :color="getUerRoleData(key).color">
                    <v-card-title>{{
                        $t("enums.UserRoles." + $enums.UserRoles.getIdName(key))
                      }}
                    </v-card-title>
                    <v-data-table
                      light
                      :headers="getTableHeaders(key)"
                      :items="group"
                      :items-per-page="10"
                      :hide-default-footer="group.length <= 10"
                      mobile-breakpoint="0"
                    >
                      <template v-slot:item.superAdmin="{ item }">
                        <v-tooltip right v-if="item.superAdmin">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-on="on" v-bind="attrs" class="d-inline-block"
                            >mdi-diamond-stone
                            </v-icon
                            >
                          </template>

                          <span>Super Admin</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:item.contractNumber="{ item }">
                        {{
                          $options.filters.contractNumberFormatter(item.contractNumber)
                        }}
                      </template>

                      <template v-slot:item.businessRegion="{ item }">
                        {{
                          item.businessRegion
                            | regionFormatter($store.getters["enums/regionsList"])
                        }}
                      </template>

                      <template v-slot:item.account_status="{ item }">
                        <v-chip
                          :color="$enums.AccountStatuses.get(item.account_status).color"
                        >
                          {{
                            $t(
                              "enums.AccountStatuses." +
                              $enums.AccountStatuses.getIdName(item.account_status)
                            )
                          }}
                        </v-chip>
                      </template>

                      <template v-slot:item.actions="{ item }">
                        <users-crud-actions
                          :item="item"
                          @userDeleted="onUserDeleted(item, group)"
                        />
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>-->

        <!-- Floating action button -->
        <v-fab-transition>
          <v-speed-dial
            v-model="floatingBtn"
            fab
            fixed
            bottom
            right
            v-if="permissions.addUsers"
          >
            <v-btn
              slot="activator"
              v-model="floatingBtn"
              color="blue lighten-2"
              fab
              dark
            >
              <v-icon v-if="!floatingBtn">mdi-plus</v-icon>
              <v-icon v-else>mdi-close</v-icon>
            </v-btn>

            <v-tooltip
              left
              :value="true"
              v-for="userBtn in newUserBtns"
              :key="userBtn.type"
              :nudge-left="20"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  dark
                  small
                  :to="`/users/new?type=${userBtn.type}`"
                  :color="$enums.UserRoles.get(userBtn.type).color"
                >
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </template>
              <span>{{
                  $t(
                    "enums.UserRoles." + $enums.UserRoles.getIdName(userBtn.type)
                  )
                }}</span>
            </v-tooltip>

            <!-- <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn fab dark small color="indigo" v-on="on">
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("pages.users.btn-filter-data") }}</span>
            </v-tooltip> -->
          </v-speed-dial>
        </v-fab-transition>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import PageHeader from "@/components/blocks/PageHeader";
import UsersCrudActions from "@/components/table/UsersCrudActions";
import usersPage from "@/functions/usersPage";
import pageBasic from "@/functions/pageBasic";
import {onMounted, computed, ref} from "@vue/composition-api";

import Permissions from "../../functions/permissions";
import DataTable from "@/components/table/DataTable";
import SigningLogsPopup from "@/components/elements/SigningLogsPopup";

export default {
  name: "index",
  components: {SigningLogsPopup, DataTable, UsersCrudActions, PageHeader},
  middleware: ["pagesAuth"],
  setup(props, {root}) {
    const {$enums, $auth} = root;
    const currentTab = ref(0);
    const permissions = Permissions(root);
    const usersPageData = usersPage(root);
    const newUserBtns = computed(() =>
      [
        {
          type: $enums.UserRoles.ADMIN,
          if: permissions.addUsers_admin
        },
        {
          type: $enums.UserRoles.SERV_CLIENTI,
          if: permissions.addUsers_servClienti
        },
        {
          type: $enums.UserRoles.AGENTE,
          if: permissions.addUsers_agente
        },
        {
          type: $enums.UserRoles.CLIENTE,
          if: permissions.addUsers_cliente
        }
      ].filter(_entry => _entry.if)
    );

    const getTabColor = computed(() => {
      const selectedTable = usersPageData.usersList.value[currentTab.value]

      return selectedTable ? $enums.UserRoles.get(selectedTable.id).color : ""
    })

    return {
      ...usersPageData,
      ...pageBasic(root, "users"),
      permissions,
      newUserBtns,
      getTabColor,
      currentTab
    };
  },
  data() {
    return {
      floatingBtn: false
    };
  }
};
</script>

<style scoped></style>
