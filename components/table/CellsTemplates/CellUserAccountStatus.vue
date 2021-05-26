<template>
  <div style="white-space: nowrap;">
    <v-chip small
            :color="$enums.AccountStatuses.get(item.account_status).color"
    >
      {{ $t("enums.AccountStatuses." + $enums.AccountStatuses.getIdName(item.account_status)) }}
    </v-chip>

    <v-tooltip v-if="item.suspended" bottom>
      <template v-slot:activator="{on}">
        <v-chip small color="red" v-on="on" @click="onSuspendedChipClick">
          <v-icon small color="white">mdi-account-off</v-icon>
        </v-chip>
      </template>
      Account sospeso
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component
export default class CellUserAccountStatus extends Vue {
  @Prop({type: Object, required: true})
  public item!: User

  onSuspendedChipClick() {
    window.open('/users/' + this.item.id, '_blank')
  }
}
</script>

<style scoped>

</style>
