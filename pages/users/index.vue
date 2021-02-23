<template>
  <v-layout>
    <v-flex>
      <page-header page-name="users"></page-header>

      <page-toolbar always-visible :actions-list="actionsList">
        <template v-slot:right-block>
          <div class="d-flex">
            <v-text-field class="align-center" hide-details
                          placeholder="Cerca..." v-model.lazy="filters.generic">

              <template v-slot:append>
                <transition name="fadeRight" mode="out-in">
                  <v-btn icon @click="filtersClean"
                         v-if="filtersActive.length"
                         style="animation-duration: 0.5s"
                         small>
                    <v-icon small>mdi-filter-remove</v-icon>
                  </v-btn>

                  <v-icon v-if="!filtersActive.length"
                          style="animation-duration: 0.5s">mdi-magnify
                  </v-icon>
                </transition>
              </template>
            </v-text-field>
          </div>
        </template>
      </page-toolbar>

      <v-tabs v-model="currentTab">
        <transition-group name="fadeRight" tag="div" class="d-flex">
          <v-tab v-for="group of usersList" :key="group.id">
            {{ $t(`enums.UserRoles.${$enums.UserRoles.getIdName(group.id)}_plural`) }}
          </v-tab>

          <v-tab :key="99" v-if="filtersActive.length">
            <v-icon class="mr-2">mdi-magnify</v-icon>

            Risultati ricerca

            <v-btn icon small @click="filtersClean" class="ml-2">
              <v-icon small>
                mdi-close
              </v-icon>
            </v-btn>
          </v-tab>
        </transition-group>
      </v-tabs>

      <v-card class="overflow-hidden">
        <v-tabs-items v-model="currentTab" touchless>
          <v-tab-item v-for="group of usersList" :key="+group.id">
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
                <v-btn text
                       v-if="item.referenceAgentData && item.referenceAgent !== $auth.user.id"
                       small
                       target="_blank"
                       class="text-capitalize"
                       color="primary"
                       :href="'users/' + item.referenceAgent">
                  <v-icon small class="mr-2">mdi-open-in-new</v-icon>
                  {{ item.referenceAgentData.firstName }} {{ item.referenceAgentData.lastName }}
                </v-btn>
                <div v-else-if="item.referenceAgentData">
                  <v-btn text disabled small>Tu</v-btn>
                </div>
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

              <template v-slot:item.commissionsAssigned="{item, value}">
                <div class="mx-n1">
                  <v-tooltip bottom v-for="(comm, i) of value" :key="i">
                    <template v-slot:activator="{ on }">
                      <v-chip x-small
                              class="mx-1"
                              v-on="on">
                        {{ getInitials($t("enums.CommissionType." + comm.name), comm) }}
                        <!--                        <template v-if="comm.percent">
                                                  &nbsp;{{ comm.percent }} %
                                                </template>-->
                      </v-chip>
                    </template>
                    {{ $t("enums.CommissionType." + comm.name) }}
                  </v-tooltip>

                </div>
              </template>

              <template v-slot:item.clientsCount="{item, value}">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn text
                           @click="showClientsList(item)"
                           :disabled="!+value"
                           v-on="on"
                           small
                           color="primary">
                      <v-icon small class="mr-2" v-if="+value === 1">mdi-account</v-icon>
                      <v-icon small class="mr-2" v-else>mdi-account-multiple</v-icon>
                      {{ +value || 0 }}
                    </v-btn>
                  </template>
                  Mostra lista clienti
                </v-tooltip>
              </template>
            </data-table>
          </v-tab-item>

          <v-tab-item :key="99" v-if="filtersActive.length">
            <data-table
              :items="filteredData"
              table-key="usersFilter"
              schema="usersSchema"
              light
              id="searchTableResults"
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

              <template v-slot:item.role="{ item }">
                <v-chip
                  small
                  dark
                  :color="$enums.UserRoles.get(item.role).color"
                >
                  {{
                    $t(
                      "enums.UserRoles." +
                      $enums.UserRoles.getIdName(item.role)
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
                <div v-if="![$enums.UserRoles.ADMIN, $enums.UserRoles.SERV_CLIENTI].includes(+item.role)">
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
                </div>
              </template>

              <template v-slot:no-data="{item}">
                adasa
              </template>
            </data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>

      <v-row v-if="$vuetify.breakpoint.smAndUp">
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
          </v-speed-dial>
        </v-fab-transition>
      </v-row>

      <clients-list-dialog
        v-if="$store.getters['dialog/dialogId'] === 'ClientsListDialog'"
      ></clients-list-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import PageHeader from "@/components/blocks/PageHeader";
import UsersCrudActions from "@/components/table/UsersCrudActions";
import usersPage from "@/functions/usersPage";
import pageBasic from "@/functions/pageBasic";
import {onMounted, computed, ref, reactive, watch} from "@vue/composition-api";

import Permissions from "../../functions/permissions";
import DataTable from "@/components/table/DataTable";
import SigningLogsPopup from "@/components/elements/SigningLogsPopup";
import PageToolbar from "@/components/blocks/PageToolbar";

import Mark from "mark.js"
import ClientsListDialog from "../../components/dialogs/ClientsListDialog";
import {UsersPermissions} from "../../functions/acl/enums/users.permissions";

export default {
  name: "index",
  components: {ClientsListDialog, PageToolbar, SigningLogsPopup, DataTable, UsersCrudActions, PageHeader},
  meta: {
    permissions: [UsersPermissions.ACL_USERS_GROUP_READ, UsersPermissions.ACL_USERS_ALL_READ]
  },
  setup(props, {root}) {
    const {$enums, $i18n, $apiCalls, $vuetify, $router, $store, $alerts} = root;
    const currentTab = ref(0);
    const lastTab = ref(0)
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
    const actionsList = computed(() => ([
      ...newUserBtns.value.reduce((acc, curr) => {
        acc.push({
          text: "users-add-" + $enums.UserRoles.getIdName(curr.type),
          if: curr.if && $vuetify.breakpoint.xsOnly,
          icon: "mdi-account",
          click: () => $router.push(`/users/new?type=${curr.type}`),
          onlyInMobile: true,
          options: {
            color: $enums.UserRoles.get(curr.type).color
          }
        })

        return acc
      }, [])
    ]))

    let markInstance = null;

    const filters = reactive({
      generic: "",
      /*firstName: "",
      lastName: "",
      email: "",*/
    })
    const filteredData = computed(() => {
      const result = []

      const filterValue = filters.generic.toLowerCase().trim().split(" ")

      const filterRegex = new RegExp(filterValue.reduce((acc, curr) => {
        if (curr) {
          const val = curr.trim()

          if (val) {
            acc.push(val)
          }
        }

        return acc
      }, []).join("|"), "g")

      for (let group of usersPageData.usersList.value) {
        const groupResult = group.data.filter((el) => {
          const valuesToSearchIn = [el.firstName.toLowerCase(), el.lastName.toLowerCase(), el.email.toLowerCase()]

          return valuesToSearchIn.some((substr) => {
            /** @type {String[]} */
            const match = substr.match(filterRegex)

            return match && filterRegex.source.split("|").every((currentValue) => match.includes(currentValue))
          })
        })

        if (groupResult.length) {
          result.push(...groupResult)
        }
      }

      return result
    })
    const filtersActive = computed(() => {
      return Object.keys(filters).reduce((acc, key) => {
        const value = filters[key]

        if (value && value.length > 1) {
          acc.push({[key]: value})
        }

        return acc
      }, [])
    })
    const getTabColor = computed(() => {
      const selectedTable = usersPageData.usersList.value[currentTab.value]

      return selectedTable ? $enums.UserRoles.get(selectedTable.id).color : ""
    })

    function filtersClean() {
      filters.generic = ""
    }

    function highlightText() {
      /*if (markInstance) {
        markInstance.mark(filters.generic);
      } else {
        setTimeout(function () {
          let context = document.querySelector("#searchTableResults tbody");

          markInstance = new Mark(context)
          markInstance.mark(filters.generic, {
            filter: ["a", "span"]
          });
        }, 300)
      }*/
    }

    /**
     * @param {import("../../@types/UserFormData").UserDataSchema} user
     */
    async function showClientsList(user) {
      try {
        // Fetch the users list
        const usersList = await $apiCalls.getClientsList(user.id)

        $store.dispatch("dialog/updateStatus", {
          title: $i18n.t("dialogs.clientsList.title"),
          id: "ClientsListDialog",
          fullscreen: false,
          large: true,
          readonly: true,
          texts: {
            cancelBtn: "dialogs.clientsList.btn-cancel"
          },
          data: {
            usersList,
            agent: user
          }
        });
      } catch (e) {
        $alerts.error(e)
      }
    }

    /**
     *
     * @param {string} str
     * @returns {string}
     */
    function getInitials(str, item) {
      switch (item.name) {
        case $enums.CommissionType.NEW_DEPOSIT:

          return item.percent + "%";
        case $enums.CommissionType.TOTAL_DEPOSIT:

          return "% / mese";
        case $enums.CommissionType.ANNUAL_DEPOSIT:

          return item.percent + "% / anno"
      }

      /* return str.split(" ")
         .map(_str => _str.slice(0, 1))
         .join("").toUpperCase()*/
    }

    watch(filtersActive, (value) => {
      const maxTabs = usersPageData.usersList.value.length

      if (value.length > 0) {
        if (currentTab.value !== maxTabs) {
          lastTab.value = currentTab.value
          currentTab.value = maxTabs
        }

        highlightText()
      } else if (currentTab.value === maxTabs - 1) {
        markInstance && markInstance.unmark()

        markInstance = null

        currentTab.value = lastTab.value
      }

    })

    return {
      ...usersPageData,
      ...pageBasic(root, "users"),
      permissions,
      newUserBtns,
      getTabColor,
      currentTab,
      filteredData,
      filtersActive,
      filters,
      actionsList,
      filtersClean,
      showClientsList,
      getInitials
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
