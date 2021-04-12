<template>
  <div>
    <dynamic-tabs :tabs-list="tabsList"
                  :loading="loading"
                  :filters-active="filtersActive"
                  @filtersClean="$emit('filtersClean')">
      <template v-for="tab of tabsList"
                v-slot:[`tabContent_${tab.id}`]="{item}">
        <data-table
          :items="tab.data"
          table-key="users"
          schema="usersSchema"
          :loading="loading"
          :condition="+$enums.UserRoles.get(tab.id).index"
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
            <!-- Case item.referenceAgent is same as userId and is the same as auth.user.id - Tu -->
            <div v-if="item.referenceAgent === $auth.user.id && item.referenceAgent === userId">
              <v-btn text disabled small>Tu</v-btn>
            </div>

            <!-- Case item.referenceAgent is same as userId but is different from auth.user.id - Utente attuale -->
            <div v-else-if="item.referenceAgent !== $auth.user.id && item.referenceAgent === userId">
              <v-btn text disabled small>Utente attuale</v-btn>
            </div>

            <!-- Case item.referenceAgent is different fron userId and from auth.user.id -  -->
            <v-btn text
                   v-else-if="item.referenceAgentData && item.referenceAgent !== $auth.user.id && item.referenceAgent !== userId"
                   small
                   target="_blank"
                   class="text-capitalize"
                   color="primary"
                   :href="'/users/' + item.referenceAgent">
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
              @userDeleted="onUserDeleted(item, tab.data)"
            />
          </template>

          <template v-slot:item.contractSignedAt="{item}">
            <div v-if="item.contractSignedAt">
              <template v-if="!item.contractImported">

                <v-menu offset-y left :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <a v-on="on" v-bind="attrs" class="text-decoration-underline-dotted">
                      {{ $t("tables.contract-signed") }}
                    </a>
                  </template>

                  <signing-logs-popup :userId="item.id"></signing-logs-popup>
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
      </template>

      <template v-slot:filterTable_superAdmin="{ item }">
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

      <template v-slot:filterTable_referenceAgent="{item}">
        <v-btn text v-if="item.referenceAgentData" small
               target="_blank"
               class="text-capitalize"
               color="primary"
               :href="'users/' + item.referenceAgent">
          <v-icon small class="mr-2">mdi-open-in-new</v-icon>
          {{ item.referenceAgentData.firstName }} {{ item.referenceAgentData.lastName }}
        </v-btn>
      </template>

      <template v-slot:filterTable_account_status="{ item }">
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

      <template v-slot:filterTable_role="{ item }">
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

      <template v-slot:filterTable_actions="{ item }">
        <users-crud-actions
          :item="item"
          @userDeleted="onUserDeleted(item, group)"
        />
      </template>

      <template v-slot:filterTable_contractSignedAt="{item}">
        <div v-if="![$enums.UserRoles.ADMIN, $enums.UserRoles.SERV_CLIENTI].includes(+item.role)">
          <div v-if="item.contractSignedAt">
            <template v-if="!item.contractImported">

              <v-menu offset-y left>
                <template v-slot:activator="{ on, attrs }">
                  <a v-on="on" v-bind="attrs" class="text-decoration-underline-dotted">
                    {{ $t("tables.contract-signed") }}
                  </a>
                </template>

                <signing-logs-popup :user-id="item.id"></signing-logs-popup>
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

          <div v-else class="red&#45;&#45;text">
            {{ $t("tables.contract-not-signed") }}
          </div>
        </div>
      </template>

    </dynamic-tabs>

    <clients-list-dialog v-if="$store.getters['dialog/dialogId'] === 'ClientsListDialog'"
    />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

import {User} from "~/@types/UserFormData";
import {DynamicTab} from "~/@types/components/DynamicTab";

import DynamicTabs from "../DynamicTabs.vue";
import DataTable from "../table/DataTable.vue";
import SigningLogsPopup from "../elements/SigningLogsPopup.vue";
import UsersCrudActions from "~/components/table/UsersCrudActions.vue";
import ClientsListDialog from "~/components/dialogs/ClientsListDialog.vue";

@Component({
  components: {ClientsListDialog, UsersCrudActions, SigningLogsPopup, DataTable, DynamicTabs}
})
export default class UsersListTable extends Vue {
  @Prop({type: String, required: true})
  public userId!: string;

  @Prop({type: Array, default: () => []})
  public filtersActive!: any[]

  loading: boolean = false;
  usersData: Record<string, User[]> = {
    [this.getRoleName(this.$enums.UserRoles.CLIENTE)]: [],
    [this.getRoleName(this.$enums.UserRoles.AGENTE)]: [],
    [this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI)]: [],
    [this.getRoleName(this.$enums.UserRoles.ADMIN)]: []
  }

  get tabsList(): DynamicTab[] {

    return [{
      id: this.getRoleName(this.$enums.UserRoles.CLIENTE),
      title: "Clienti",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.CLIENTE)]
    }, {
      id: this.getRoleName(this.$enums.UserRoles.AGENTE),
      title: "Agenti",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.AGENTE)]
    }, {
      id: this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI),
      title: "Servizio Clienti",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI)]
    }, {
      id: this.getRoleName(this.$enums.UserRoles.ADMIN),
      title: "Admin",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.ADMIN)]
    }].filter(el => el.data && el.data.length > 0)
  }

  getRoleName(role: number | string) {
    return this.$enums.UserRoles.getIdName(+role)
  }

  getInitials(str: any, item: any): string {
    switch (item.name) {
      case this.$enums.CommissionType.NEW_DEPOSIT:

        return item.percent + "%";
      case this.$enums.CommissionType.TOTAL_DEPOSIT:

        return "% / mese";
      case this.$enums.CommissionType.ANNUAL_DEPOSIT:

        return item.percent + "% / anno"
    }

    return ""
  }

  async showClientsList(user: User) {
    try {
      // Fetch the users list
      const usersList = await this.$apiCalls.getClientsList(user.id)

      await this.$store.dispatch("dialog/updateStatus", {
        title: this.$i18n.t("dialogs.clientsList.title"),
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
      this.$alerts.error(e)
    }
  }

  onUserDeleted(item: User, data: any[]) {
    const index = data.findIndex(_el => _el.id === item.id)

    this.$delete(data, index)
  }

  public async updateData() {
    this.loading = true

    try {
      let usersList: any[] = []

      if (this.$auth.user.id !== this.userId || this.$auth.user.role === this.$enums.UserRoles.AGENTE) {
        usersList = await this.$apiCalls.getClientsList(this.userId)

        for (const user of usersList) {
          if (user.id === this.userId) {
            continue
          }

          this.usersData[this.$enums.UserRoles.getIdName(+user.role)].push(user)
        }
      } else {
        usersList = await this.$apiCalls.fetchAllUsers()

        for (const group of usersList) {
          this.usersData[this.getRoleName(+group.id)].push(...group.data)
        }
      }


    } catch (e) {
      console.error(e)
    }

    this.loading = false
  }

  // @ts-ignore
  async mounted() {
    await this.updateData()
  }
}
</script>

<style scoped>

</style>
