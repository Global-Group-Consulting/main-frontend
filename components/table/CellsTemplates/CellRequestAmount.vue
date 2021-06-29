<template>
  <v-flex class="d-flex">
    <span style="flex: 1"></span>

    <span :class="getAmountClass(getAmountSign(item.type))"
          class="text-no-wrap"
          v-if="!item.autoWithdrawlAll || item.autoWithdrawlAllRevoked"
          v-html="getAmountValue()">

      <!--      {{ getAmountSign(item.type) }}

            € {{ $options.filters.moneyFormatter(item.amount) }}

            <span v-if="item.briteConversionPercentage === 100 || item.currency === $enums.CurrencyType.BRITE">
              ( Br' {{ $options.filters.moneyFormatter(item.amountBrite, true) }} )
            </span>-->
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
import {moneyFormatter} from "~/plugins/filters/moneyFormatter";
import CurrencyType from "~/enums/CurrencyType";
import {template} from "lodash";
import {TableSchema} from "~/@types/config/TableSchema";


@Component({})
export default class CellRequestAmount extends Vue {
  @Prop({type: Object, required: true})
  public item!: RequestFormData

  @Prop({type: Object, default: () => ({})})
  public colConfig!: TableSchema

  getAmountClass(sign: '-' | '+' | '*') {
    const minus = "red--text";
    const plus = "green--text";
    const wildcard = "orange--text";

    return sign === "-" ? minus : (sign === "*" ? wildcard : plus);
  }

  getAmountSign() {
    if ([
      this.$enums.RequestTypes.VERSAMENTO,
      this.$enums.RequestTypes.COMMISSION_MANUAL_ADD,
    ].includes(this.item.type)) {
      return "+"
    } else if (this.$enums.RequestTypes.COMMISSION_MANUAL_ADD === this.item.type) {
      return "*"
    } else {
      return "-";
    }
  }

  getAmountValue() {
    const sign = this.getAmountSign();
    const result = [sign];
    const eurValue = moneyFormatter(this.item.amount)
    const brtValue = moneyFormatter(this.item.amountBrite || (+this.item.amount * 2), true)
    const eurString = "€ " + eurValue;
    const brtString = "Br' " + brtValue;

    let smallText = template("<br><small class='font-italic black--text'>( ${text} )</small>");
    let smallBritePercentText = template("<br><small class='font-italic black--text'>( € ${eurValue} e Br' ${brtValue} )</small>");

    if (this.item.currency === CurrencyType.BRITE && (!this.item.briteConversionPercentage || this.item.briteConversionPercentage === 100)) {
      result.push(brtString, smallText({text: eurString}));
    } else {
      result.push(eurString);
    }

    if (this.item.briteConversionPercentage) {
      if (this.item.briteConversionPercentage === 100) {
        //result.push(smallText({text: brtString}));
      } else if (this.item.briteConversionPercentage > 0) {
        result.push(smallBritePercentText({eurValue: moneyFormatter(this.item.amountEuro), brtValue}));
      }
    }

    return result.join(" ");
  }
}
</script>

<style scoped>

</style>
