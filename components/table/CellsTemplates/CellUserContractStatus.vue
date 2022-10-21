<template>
  <div v-if="![$enums.UserRoles.ADMIN, $enums.UserRoles.SERV_CLIENTI].includes(+item.role)">
    <div v-if="item.contractSignedAt">
      <template v-if="!item.contractImported">

        <v-menu offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <a v-on="on" v-bind="attrs" class="text-decoration-underline-dotted">
              {{ $t('tables.contract-signed') }}
            </a>
          </template>

          <signing-logs-popup :user-id="item.id || item._id"></signing-logs-popup>
        </v-menu>
      </template>

      <template v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{on}">
            <a v-on="on" class="text-decoration-underline-dotted">
              {{ $t('tables.contract-imported') }}
            </a>
          </template>
          <span>{{
              $t('tables.contract-imported-at', { date: $options.filters.dateHourFormatter(item.contractSignedAt) })
            }}</span>
        </v-tooltip>
      </template>
    </div>

    <div v-else class="red--text">
      {{ $t('tables.contract-not-signed') }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { User } from '~/@types/UserFormData'
import SigningLogsPopup from '~/components/elements/SigningLogsPopup.vue'

@Component({
  components: { SigningLogsPopup }
})
export default class CellUserContractNumber extends Vue {
  @Prop({ type: Object, required: true })
  public item!: any

  get user (): User {
    return this.item?.user
  }
}
</script>

<style scoped>

</style>
