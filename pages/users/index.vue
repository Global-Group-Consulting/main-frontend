<template>
  <v-layout>
    <v-flex>
      <page-header page-name="users"></page-header>

      <dashboard-blocks :dashboard-data="usersDataBlocks"
                        class="mb-6"
                        readonly
                        page="users"
                        format-as-int
      ></dashboard-blocks>

      <page-toolbar always-visible :actions-list="actionsList" filters-schema="users">

      </page-toolbar>

      <users-list-table :user-id="$auth.user.id" :filters-active="filtersActive"
                        @filtersClean="filtersClean">

      </users-list-table>

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

    </v-flex>
  </v-layout>
</template>

<script>
import PageHeader from "@/components/blocks/PageHeader";
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
import UsersListTable from "../../components/table/UsersListTable";
import DashboardBlocks from "../../components/DashboardBlocks";
import AccountStatuses from "../../enums/AccountStatuses";

import {usersFiltersFieldsMap} from "../../config/forms/filters/usersFiltersSchema";

export default {
  name: "index",
  components: {
    DashboardBlocks,
    UsersListTable,
    ClientsListDialog,
    PageToolbar,
    SigningLogsPopup,
    DataTable,
    PageHeader
  },
  meta: {
    permissions: [UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ]
  },
  setup(props, {root}) {
    const {$enums, $i18n, $apiCalls, $vuetify, $router, $store, $alerts, $auth} = root;
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

    const filters = ref({})
    const filteredData = computed(() => {
      const result = []


      //const filterValue = filters.generic.toLowerCase().trim().split(" ")

      /*    const filterRegex = new RegExp(filterValue.reduce((acc, curr) => {
            if (curr) {
              const val = curr.trim()

              if (val) {
                acc.push(val)
              }
            }

            return acc
          }, []).join("|"), "g")*/

      for (let group of usersPageData.usersList.value) {
        const groupResult = group.data.filter((el) => {
          let mustReturn = false;

          // Fort each available field, check the corresponding fields that must be filtered
          for (let key of Object.keys(usersFiltersFieldsMap)) {
            //const valuesToSearchIn = [el.firstName.toLowerCase(), el.lastName.toLowerCase(), el.email.toLowerCase()]
            const valuesToSearchIn = []

            for (const field of usersFiltersFieldsMap[key]) {
              let value = el[field]

              if (typeof value === "string") {
                value = value.toLowerCase()
              }

              valuesToSearchIn.push(value)
            }

            valuesToSearchIn.some((substr) => {
              const match = substr.match(filters.value[key])

              if (match) {
                mustReturn = match
              }
              //return match && filterRegex.source.split("|").every((currentValue) => match.includes(currentValue))
            })
          }

          return mustReturn
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

    const usersDataBlocks = computed(() => {
      const userIsAgente = $store.getters["user/userIsAgente"];
      const usersStatistics = $store.getters["users/usersStatistics"];
      const agentUsersStatistics = $store.getters["users/agentUsersStatistics"];

      return {
        blocks: userIsAgente ? agentUsersStatistics : usersStatistics
      }
    });


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

    function onAppliedFilter(activeFilters) {
      filters.value = activeFilters
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
      getInitials,
      usersDataBlocks,
      onAppliedFilter
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
