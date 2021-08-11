<template>
  <data-table
    :items="movements"
    table-key="movements"
    schema="movementsSchema"
    :loading="loading"
    :items-per-page="25"
    :item-class="getItemClass"
    :options="{
        sortBy: ['created_at'],
        sortDesc: [true]
      }"
  >
    <template v-slot:item.amountChange="{ item }">
      <div v-html="formatAmountChange(item)"></div>
    </template>

    <template v-slot:item.movementType="{ item }">
      <v-tooltip bottom v-if="item.notes">
        <template v-slot:activator="{ on }">
          <a class="text-decoration-underline-dotted" v-on="on" v-html="formatMovementType(item)"></a>
        </template>

        <span>{{ item.notes }}</span>
      </v-tooltip>

      <div v-else v-html="formatMovementType(item)"></div>
    </template>

    <template v-slot:item.deposit="{ item }">
        <span class="text-no-wrap">
          € {{ $options.filters.moneyFormatter(item.deposit) }}
        </span>
    </template>

    <template v-slot:item.interestAmount="{ item }">
        <span class="text-no-wrap">
          € {{ $options.filters.moneyFormatter(item.interestAmount) }}
        </span>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-menu offset-y v-if="getCrudActions(item).length > 0">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" icon v-on="on" :loading="downloadLoading === item.id">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <template v-for="entry in getCrudActions(item)">
            <v-divider
              v-if="entry.divider"
              :key="'divider_' + entry.value"
            ></v-divider>
            <v-list-item :key="entry.value" :entry="entry" @click="entry.action(item)">
              <v-list-item-title>{{
                  $t("menus." + entry.value)
                }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </template>
  </data-table>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {IMovement, Movement} from "~/@types/Movement";
import DataTable from "~/components/table/DataTable.vue";
import MovementTypes from "~/enums/MovementTypes";

import jsFileDownload from "js-file-download";
import UserRoles from "~/enums/UserRoles";

interface CrudAction {
  value: string
  if?: boolean
  divider?: string

  action(entry: IMovement): void
}

@Component({
  components: {DataTable}
})
export default class MovementsListTable extends Vue {
  @Prop({type: String, required: true})
  userId!: string

  movements: IMovement[] = [];
  loading = false
  downloadLoading = ""

  get authUserType(): "user" | "admin" {
    return [UserRoles.AGENTE, UserRoles.CLIENTE].includes(this.$auth.user.role) ? "user" : "admin"
  }

  formatAmountChange(item: any) {
    const sign = [
      MovementTypes.INTEREST_COLLECTED,
      MovementTypes.DEPOSIT_COLLECTED,
      MovementTypes.COMMISSION_COLLECTED,
      MovementTypes.CANCEL_DEPOSIT_ADDED,
      MovementTypes.MANUAL_INTEREST_COLLECTED,
    ].includes(item.movementType)
      ? "-"
      : "+";
    const color = sign === "-" ? "red--text" : "green--text";

    return `<span class="text-no-wrap ${color}">€ ${sign}${this.$options?.filters?.moneyFormatter(
      item.amountChange.toFixed(2)
    )}</span>`;
  }

  formatMovementType(item: IMovement) {
    const reqType = item.requestType;
    const movementId = MovementTypes.get(item.movementType).id;
    let text = this.$i18n.t(`enums.MovementTypes.${movementId}`);
    let movementToAvoid = [
      this.$enums.MovementTypes.CANCEL_INTEREST_COLLECTED,
      this.$enums.MovementTypes.CANCEL_DEPOSIT_COLLECTED,
      this.$enums.MovementTypes.CANCEL_COMMISSION_COLLECTED,
      this.$enums.MovementTypes.CANCEL_DEPOSIT_ADDED
    ]

    if (reqType && !movementToAvoid.includes(item.movementType)) {
      text = this.$i18n.t(`enums.RequestTypes.${this.$enums.RequestTypes.getIdName(reqType)}`)
    }

    if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
      return `<strong>${text}</strong>`;
    }

    return text;
  }

  getItemClass(item: IMovement) {
    if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
      return "yellow lighten-5";
    }
  }

  getCrudActions(item: Movement): CrudAction[] {
    return [
      {
        value: "downloadReceipt",
        action: (movement: IMovement) => this.downloadReceipt(item.id, movement),
        if: this.authUserType === "user" && item.movementType === this.$enums.MovementTypes.DEPOSIT_ADDED
      }
    ].filter(el => "if" in el ? el.if : true)
  }

  public async updateData() {
    this.loading = true;

    try {
      this.movements = await this.$apiCalls.fetchMovementsList(this.userId);
    } catch (er) {
      console.error(er)
    }

    this.loading = false
  }

  async downloadReceipt(movementId: string, movement: IMovement) {
    let toReturn = false

    this.downloadLoading = movement.id

    try {
      const result = await this.$apiCalls.downloadRequestReceipt(movementId, "movement")

      jsFileDownload(result.data, result.headers["x-file-name"]);

      toReturn = true
    } catch (er) {
      this.$alerts.error(er)
    }

    this.downloadLoading = ""

    return toReturn
  }

  async mounted() {
    await this.updateData()
  }
}
</script>
