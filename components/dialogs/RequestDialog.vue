<template>
  <div>
    <portal to="dialog-content">
      <v-form :disabled="!!readonly">
        <dynamic-fieldset
          :ref="'request-form'"
          :schema="requestSchema"
          v-model="formData"
          fill-row
        />
      </v-form>
    </portal>

    <portal to="dialog-actions-left">
      <v-btn color="red" text v-if="canDelete" @click="onDelete">{{
        $t("dialogs.requests.btn-delete")
      }}</v-btn>
      <!-- <v-btn color="red">{{ $t("dialogs.requests.btn-reject") }}</v-btn>
      <v-btn color="success">{{ $t("dialogs.requests.btn-accept") }}</v-btn> -->
    </portal>

    <portal to="dialog-actions-right">
      <v-btn text @click="close">
        {{ $t(`dialogs.requests.btn-${isNew ? "cancel" : "close"}`) }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="onFormSubmit" v-if="isNew">
        {{ $t("dialogs.requests.btn-send") }}
      </v-btn>
    </portal>
  </div>
</template>

<script>
import DynamicFieldset from "@/components/DynamicFieldset";
import requestSchema from "@/config/forms/requestSchema";

import { mapGetters, mapState } from "vuex";
import { ref } from "@vue/composition-api";

import requestsCrudActionsFn from "../../functions/requestsCrudActions";

export default {
  name: "RequestDialog",
  components: { DynamicFieldset },
  props: {
    value: false,
    requestData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    const formData = ref({
      wallet: 1
    });
    const actions = requestsCrudActionsFn(formData, root);

    async function onDelete() {
      const result = await actions.delete(this.formData);

      if (result) {
        this.close();

        emit("requestDeleted");
      }
    }

    return { formData, onDelete };
  },
  data() {
    return {
      opened: false
    };
  },
  computed: {
    requestSchema,
    ...mapGetters({
      dialogData: "dialog/dialogData",
      userWallets: "user/availableWallets"
    }),
    requestTypes() {
      return this.$enums.RequestTypes.list.reduce((acc, item) => {
        acc.push({
          value: item.text,
          text: this.$t(`enums.RequestTypes.${item.text}`)
        });

        return acc;
      }, []);
    },
    availableAmount() {
      if (
        this.formData.availableAmount &&
        [
          this.$enums.UserRoles.ADMIN,
          this.$enums.UserRoles.SERV_CLIENTI
        ].includes(this.$auth.user.role)
      ) {
        return this.formData.availableAmount;
      }

      const wallet = this.userWallets.find(
        _wallet => _wallet.type === (this.formData.wallet || 1)
      );

      console.log(wallet);

      return wallet?.amount ?? 0;
    },
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
          amount: this.formData.amount,
          userId: this.$auth.user.id,
          type: this.formData.type,
          wallet: this.formData.wallet,
          currency: this.formData.currency,
          notes: this.formData.notes,
          requestAttachment: this.formData.requestAttachment
        };

        await this.$alerts.askBeforeAction({
          key: "send-request",
          preConfirm: async () => {
            const result = await this.$apiCalls.createRequest(data);
          },
          data: {
            type: this.$t(
              "enums.RequestTypes." +
                this.$enums.RequestTypes.get(this.formData.type).id
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
  },
  watch: {
    "formData.type": {
      immediate: true,
      handler() {
        this.formData.wallet = this.$enums.WalletTypes.DEPOSIT;
        this.formData.currency = this.$enums.CurrencyType.EURO;
      }
    },
    "formData.wallet": {
      immediate: true,
      handler(wallet) {
        this.formData.availableAmount = this.availableAmount;
      }
    },
    "dialogData.data": {
      deep: true,
      immediate: true,
      handler(value) {
        if (!value) {
          this.$set(this, "formData", {
            wallet: 1
          });
        }

        Object.keys(value || {}).forEach(key => {
          if (key.indexOf("_") != 0) {
            this.$set(this.formData, key, value[key]);
          }
        });

        this.$set(
          this.formData,
          "type",
          value?.type || this.$enums.RequestTypes["VERSAMENTO"]
        );
        this.$set(
          this.formData,
          "wallet",
          value?.wallet || this.$enums.WalletTypes["DEPOSIT"]
        );
        this.$set(
          this.formData,
          "availableAmount",
          value?.availableAmount || this.availableAmount
        );
        this.$set(
          this.formData,
          "currency",
          value?.currency || this.$enums.CurrencyType["EURO"]
        );
      }
    }
  }
};
</script>
