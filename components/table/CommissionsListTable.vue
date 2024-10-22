<template>
  <data-table
      :items="commissions"
      table-key="commissions"
      schema="commissionsSchema"
      :loading="loading"
      :items-per-page="25"
      :item-class="getItemClass"
      :options="{
              sortBy: ['created_at'],
              sortDesc: [true]
            }"
  >
    <!--    <template v-slot:item.amountChange="{ item }">
          <div v-html="formatAmountChange(item)"></div>
        </template>-->

    <template v-slot:item.user="{ item }">
      <div v-if="item.user">
        {{ item.user.firstName }} {{ item.user.lastName }}
        ({{ $t('enums.UserRoles.' + $enums.UserRoles.getIdName(+item.user.role)) }})
      </div>
    </template>

    <template v-slot:item.commissionType="{ item }">
      <v-menu offset-y v-if="item.notes">
        <template v-slot:activator="{ on, attrs }">
          <a class="text-decoration-underline-dotted" v-on="on" v-bind="attrs"
             v-html="formatCommissionType(item)"></a>
        </template>
        <v-card
            color="white"
            elevation="1"
        >
          <v-card-text v-html="item.notes"></v-card-text>
        </v-card>
      </v-menu>

      <div v-else v-html="formatCommissionType(item)" style="display: inline-block"></div>

    </template>

    <template v-slot:item.commissionPercentage="{ item }">
              <span v-if="item.commissionPercentage">
                {{ item.commissionPercentage }} %
              </span>
    </template>

    <template v-slot:item.currMonthCommissions="{ item }">
              <span class="text-no-wrap">
                € {{ item.currMonthCommissions|moneyFormatter }}
              </span>
    </template>

  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import DataTable from './DataTable.vue'
import CommissionType from '@/enums/CommissionType'
import { IMovement } from '~/@types/Movement'
import { Commission } from '~/@types/Commission'

@Component({
  components: { DataTable }
})
export default class CommissionsListTable extends Vue {
  @Prop({ type: String, required: true })
  userId!: string
  commissions: Commission[] = []
  loading = false

  formatAmountChange (item: IMovement) {
    const sign = [
      CommissionType.NEW_DEPOSIT,
      CommissionType.ANNUAL_DEPOSIT,
      CommissionType.TOTAL_DEPOSIT,
      CommissionType.MANUAL_ADD,
      CommissionType.MANUAL_TRANSFER
    ].includes(item.commissionType)
        ? '+'
        : '-'
    const color = sign === '-' ? 'red--text' : 'green--text'

    return `<span class="text-no-wrap ${color}">€ ${sign}${
        this.$options?.filters?.moneyFormatter((item.amountChange || 0).toFixed(2)
        )}</span>`
  }

  formatCommissionType (item: IMovement) {
    const commissionId = CommissionType.get(item.commissionType).id
    const text = this.$t(`enums.CommissionType.${commissionId}`)

    if (item.commissionType === CommissionType.COMMISSIONS_REINVESTMENT) {
      return `<strong>${text}</strong>`
    }

    return text
  }

  getItemClass (item: IMovement) {
    if (item.commissionType === CommissionType.COMMISSIONS_TO_REINVEST) {
      return 'yellow lighten-5'
    }
  }

  public async updateData () {
    this.loading = true

    try {
      this.commissions = await this.$apiCalls.fetchCommissionsList(this.userId)
    } catch (er) {
      console.error(er)
    }

    this.loading = false
  }

  async mounted () {
    await this.updateData()
  }
}
</script>

<style scoped>

</style>
