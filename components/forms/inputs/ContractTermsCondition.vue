<template>
  <v-layout column>
    <slot name="label"></slot>

    <v-list dense class="pt-0">
      <v-list-item >
        <a href="#" @click="openDialog" class="">
          {{ $t("forms.contract-terms-condition-open") }}
        </a>
      </v-list-item>
    </v-list>

    <contract-terms-condition-dialog v-if="$store.getters['dialog/dialogId'] === 'ContractTermsConditionDialog'"/>
  </v-layout>
</template>

<script lang="ts">
import {Prop, Vue} from "vue-property-decorator";
import Component from "vue-class-component";
import ContractTermsConditionDialog from "~/components/dialogs/ContractTermsConditionDialog.vue";

@Component({
  components: {ContractTermsConditionDialog}
})
export default class ContractTermsCondition extends Vue {
  @Prop({type: String})
  public contractPercentage!: string

  openDialog() {
    this.$store.dispatch("dialog/updateStatus", {
      title: this.$t("dialogs.contractTermsCondition.title"),
      id: "ContractTermsConditionDialog",
      readonly: true,
      texts: {
        cancelBtn: "dialogs.contractTermsCondition.btn-cancel",
      },
      data: {
        contractPercentage: this.contractPercentage
      }
    });
  }
}
</script>
