<template>
  <div>
    <portal to="dialog-pre-content">
      <div class="d-flex justify-center" style="margin-bottom: -100px">
        <v-img src="global_club/bg_wide.jpg" max-width="600px" eager transition="fade"></v-img>
      </div>
    </portal>

    <portal to="dialog-content">
      <v-row justify="center">
        <v-col lg="6" md="8" sm="12">
          <v-form :disabled="!!readonly" @submit.prevent="">

            <v-tabs height="58px"
                    grow
                    slider-color="#ffcf5f"
                    :show-arrows="false"
                    class="global-club-tabs"
                    v-model="tabsModel"
            >
              <v-tab :key="'brite'" v-html="$t('dialogs.requests.tab-brite')"></v-tab>
              <v-tab :key="'gold'" v-html="$t('dialogs.requests.tab-gold')"></v-tab>
            </v-tabs>
            <div>
              <v-card flat class="py-10" light>
                <v-card-text>
                  <dynamic-fieldset
                    :ref="'request-form'"
                    :schema="tabsModel === 0 ? briteSchema: goldSchema"
                    v-model="formData"
                    fill-row
                  />
                </v-card-text>
              </v-card>
            </div>

            <v-card dark>
              <v-card-text class="d-flex justify-end">
                <div>
                  <v-btn outlined dark color="grey" @click="close">{{ $t("dialogs.requests.btn-cancel") }}</v-btn>
                  <v-btn depressed dark color="primary" @click="onFormSubmit">{{
                      $t("dialogs.requests.btn-send-club")
                    }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </portal>
  </div>
</template>

<script>
import {
  ref,
  onBeforeMount,
  reactive,
  watch,
  computed
} from "@vue/composition-api";
import {createNamespacedHelpers} from "vuex-composition-helpers";

import DynamicFieldset from "@/components/DynamicFieldset";
import {briteSchema, goldSchema} from "@/config/forms/requestGoldSchema";

import permissionsFn from "../../functions/permissions";
import {admin} from "../../config/roleBasedConfig";

export default {
  name: "RequestDialogGold",
  components: {DynamicFieldset},
  props: {
    value: false,
    requestData: {
      type: Object,
      default: () => ({})
    }
  },
  /**
   * @param {{}} props
   * @param {{root: {
   *    $enums: typeof import("../../plugins/enums").enums,
   *    $apiCalls: import("../../plugins/apiCalls").ApiCalls
   * }, emit: function}} param1
   */
  setup(props, {root, emit}) {
    const {$auth, $apiCalls, $store, $enums} = root;
    const {useGetters: dialogUseGetters} = createNamespacedHelpers("dialog");
    const {useGetters: userUseGetters} = createNamespacedHelpers("user");
    const {dialogData} = dialogUseGetters(["dialogData"]);
    const {availableWallets} = userUseGetters(["availableWallets"]);
    const permissions = permissionsFn(root);
    const incomingData = computed(() => dialogData.value?.data || {})
    const tabsModel = ref(incomingData.value.type === $enums.RequestTypes.RISC_CAPITALE_GOLD ? 1 : 0)

    const formData = ref({
      ...dialogData.value?.data,
      wallet: $enums.WalletTypes.DEPOSIT,
      type: incomingData.value.type || $enums.RequestTypes.RISC_INTERESSI_BRITE,
      typeClub: tabsModel.value === 0 ? "brite" : "gold",
      availableAmount: dialogData.value?.data.availableAmount || 0,
      currency: dialogData.value?.data.currency || $enums.CurrencyType["EURO"],
      clubCardNumber: $auth.user.clubCardNumber,
      requestIban: $auth.user.contractIban,
    });

    const wallet = computed(() => {
      return availableWallets.value.find(
        _wallet => _wallet.type === (formData.value.wallet || 1)
      );
    });

    const availableAmount = computed(() => {
      const adminUser = [
        $enums.UserRoles.ADMIN,
        $enums.UserRoles.SERV_CLIENTI
      ].includes($auth.user.role);

      if (
        formData.value.status !== $enums.RequestStatus.NUOVA &&
        formData.value.id
      ) {
        return formData.value.availableAmount;
      }

      let toReturn = 0;

      // Tutte le richieste di questo dialog hanno come importo disponibile le rendite.
      // Per il prelievo del deposito occorre usare un altro canale

      /*switch (formData.value.type) {
        case $enums.RequestTypes.RISC_CAPITALE_GOLD:
          toReturn = wallet.value?.deposit ?? 0;
          break;
        case $enums.RequestTypes.RISC_INTERESSI_BRITE:
          toReturn = wallet.value?.interestAmount ?? 0;
          break;
      }*/

      toReturn = wallet.value?.interestAmount ?? 0;

      return toReturn;
    });

    const canApprove = computed(() => {
      const isNewRequest =
        $enums.RequestStatus.NUOVA === +formData.value.status;
      const isInProgress =
        $enums.RequestStatus.LAVORAZIONE === +formData.value.status;
      const ownByAdmin =
        isInProgress &&
        $auth.user.id === formData.value.conversation.createdById;

      return (isNewRequest || ownByAdmin) && permissions.userType === "admin";
    });

    async function onDelete() {
      const result = await actions.delete(this.formData);

      if (result) {
        this.close();

        emit("requestDeleted");
      }
    }

    async function onApprove() {
      const result = await actions.approve(formData.value);

      if (result) {
        this.close();

        emit("requestStatusChanged");
      }
    }

    async function onReject() {
      const result = await actions.reject(formData);

      if (result) {
        this.close();

        emit("requestStatusChanged");
      }
    }

    watch(
      availableAmount,
      value => {
        formData.value.availableAmount = availableAmount.value;
      },
      {immediate: true}
    );
    watch(
      tabsModel,
      type => {
        formData.value.type = type === 0 ? $enums.RequestTypes.RISC_INTERESSI_BRITE : $enums.RequestTypes.RISC_CAPITALE_GOLD;
        formData.value.typeClub = type === 0 ? "brite" : "gold"
      },
      {immediate: true}
    );

    onBeforeMount(async () => {
      /*
      If the request has a status different from new, don't try to fetch the user's wallet
      because it will use the availableAmount stored in the request
      */
      if (
        formData.value.status !== $enums.RequestStatus.NUOVA &&
        formData.value.id
      ) {
        return;
      }

      const data = {};

      if (permissions.userType === "admin") {
        data.userId = formData.value.userId;
      }

      $store.dispatch("user/updateWallets", {apiCalls: $apiCalls, data});
    });

    return {
      formData,
      tabsModel,
      onDelete,
      onApprove,
      onReject,
      permissions,
      dialogData,
      availableWallets,
      canApprove
    };
  },
  data() {
    return {
      opened: false,
    };
  },
  computed: {
    goldSchema,
    briteSchema,
    isNew() {
      return !this.formData.id;
    },
    readonly() {
      return this.formData.requestState;
      // return this.$enums.RequestStatus.NUOVA !== this.requestData.requestState
    },
    canDelete() {
      return (
        this.formData.id &&
        this.formData.userId === this.$auth.user.id &&
        this.formData.status === this.$enums.RequestStatus.NUOVA
      );
    },
    canEdit() {
      const allowedRoles = [
        this.$enums.UserRoles.ADMIN,
        this.$enums.UserRoles.SERV_CLIENTI
      ];
      const allowedState = [this.$enums.RequestStatus.NUOVA];

      return (
        allowedRoles.includes(this.$auth.user.role) &&
        allowedState.includes(this.formData.requestState)
      );
    }
  },
  methods: {
    close() {
      this.$refs["request-form"]?.reset();
      this.$store.dispatch("dialog/updateStatus", false);
    },
    async onFormSubmit() {
      try {
        if (!(await this.$refs["request-form"].validate(false))) {
          return;
        }

        const data = {
          amount: this.formData.requestAmount,
          iban: this.formData.requestIban,
          clubCardNumber: this.formData.clubCardNumber,
          userId: this.$auth.user.id,
          type: this.formData.type,
          typeClub: this.formData.typeClub,
          wallet: this.formData.wallet,
          currency: this.formData.currency,
          notes: this.formData.notes,
        };

        await this.$alerts.askBeforeAction({
          key: "send-request-" + data.typeClub,
          preConfirm: async () => {
            const result = await this.$apiCalls.createRequest(data);
          },
          data: {
            type: this.$t(
              "enums.RequestTypes." +
              this.$enums.RequestTypes.get(data.type).id
            ),
            amount:
              this.$enums.CurrencyType.get(data.currency).symbol +
              " " +
              this.$options.filters.moneyFormatter(data.amount)
          }
        });

        this.$emit("newRequestAdded");

        this.close();
      } catch (er) {
        console.log(er);
      }
    }
  }
};
</script>


<style scoped lang="scss">
.global-club-tabs::v-deep {
  .v-slide-group__prev {
    display: none !important;
  }
}
</style>
