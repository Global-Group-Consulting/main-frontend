<template>
  <v-flex class="d-flex">
    <span style="flex: 1"></span>

    <span :class="getAmountClass(getAmountSign(item.type))"
          class="text-no-wrap"
          v-html="getAmountValue()">
    </span>

  </v-flex>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {AgentBrite} from "~/@types/AgentBrite";
import AgentBritesType from "~/enums/AgentBritesType";
import {moneyFormatter} from "~/plugins/filters/moneyFormatter";
import {template} from "lodash";
import CurrencyType from "~/enums/CurrencyType";

@Component({})
export default class CellAgentBriteAmount extends Vue {
  @Prop({type: Object, required: true})
  public item!: AgentBrite

  @Prop({type: Number})
  public value!: any


  getAmountClass(sign: '-' | '+' | '*') {
    const minus = "red--text";
    const plus = "green--text";
    const wildcard = "orange--text";

    return sign === "-" ? minus : (sign === "*" ? wildcard : plus);
  }

  getAmountSign() {
    if ([AgentBritesType.FROM_WITHDRAWL, AgentBritesType.MANUAL_ADD].includes(this.item.type)) {
      return "+"
    } else {
      return "-";
    }
  }

  getAmountValue() {
    const sign = this.getAmountSign();
    const brtValue = moneyFormatter(this.value, true)
    const brtString = "Br' " + sign + brtValue;

    return [brtString].join(" ");
  }

}
</script>

<style scoped>

</style>
