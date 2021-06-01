<template>
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

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserCommissionsAssigned extends Vue {
  @Prop({type: Object, required: true})
  public item!: User

  get value() {
    return this.item.commissionsAssigned;
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
}
</script>

<style scoped>

</style>
