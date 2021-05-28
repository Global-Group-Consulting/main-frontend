<template>
  <v-flex class="d-flex">
    <span style="flex: 1"></span>

    <span :class="getAmountClass(getAmountSign(item.type))"
          class="text-no-wrap"
          v-if="!item.autoWithdrawlAll || item.autoWithdrawlAllRevoked">
          {{ getAmountSign(item.type) }}
          € {{ $options.filters.moneyFormatter(item.amount) }}
        </span>

    <v-tooltip v-else bottom>
      <template v-slot:activator="{ on }">
        <v-btn text rounded v-on="on" color="primary">
          <v-icon v-if="item.autoWithdrawlAllRecursively">mdi-repeat</v-icon>
          <v-icon>mdi-infinity</v-icon>
        </v-btn>
      </template>

      {{ $t(`pages.requests.autoWithdrawlAll${item.autoWithdrawlAllRecursively ? 'Recursive' : ''}-tooltip`) }}
    </v-tooltip>

  </v-flex>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";
import {RequestFormData} from "~/@types/Requests";

@Component({})
export default class CellRequestAmount extends Vue {
  @Prop({type: Object, required: true})
  public item!: RequestFormData

  getAmountClass(sign: '-' | '+' | '*') {
    const minus = "red--text";
    const plus = "green--text";
    const wildcard = "orange--text";

    return sign === "-" ? minus : (sign === "*" ? wildcard : plus);
  }

  getAmountSign(requestType: number) {
    if ([
      this.$enums.RequestTypes.VERSAMENTO,
      this.$enums.RequestTypes.COMMISSION_MANUAL_ADD,
    ].includes(requestType)) {
      return "+"
    } else if (this.$enums.RequestTypes.COMMISSION_MANUAL_ADD === requestType) {
      return "*"
    } else {
      return "-";
    }
  }
}
</script>

<style scoped>

</style>
