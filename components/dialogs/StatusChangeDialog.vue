<template>
  <v-layout class="status-changed-dialog">
    <portal to="dialog-content">
      <v-alert outlined type="warning" class="mt-4" prominent>{{
        $t("dialogs.statusChange.alert")
      }}</v-alert>

      <v-radio-group v-model="newStatus" mandatory>
        <v-radio
          v-for="(status, i) of statusesList"
          :key="i"
          :value="status.value"
        >
          <template v-slot:label>
            <div>
              {{ $t("enums.AccountStatuses." + status.value) }}
              <br />
              <small>{{
                $t("enums.AccountStatuses." + status.value + "_desc")
              }}</small>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="blue darken-1" text @click="close">
        {{ $t("dialogs.statusChange.btn-cancel") }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="onApply">
        {{ $t("dialogs.statusChange.btn-confirm") }}
      </v-btn>
    </portal>
  </v-layout>
</template>

<script>
import AccountStatuses from "../../enums/AccountStatuses";
import { mapGetters } from "vuex";

export default {
  name: "StatusChangeDialog",
  data() {
    return {
      newStatus: ""
    };
  },
  computed: {
    ...mapGetters({ dialogData: "dialog/dialogData" }),
    statusesList() {
      return AccountStatuses.list.filter(_status => true);
    }
  },
  methods: {
    close() {
      this.$store.dispatch("dialog/updateStatus", false);
    },
    async onApply() {
      /** @type {import('../../@types/ApiCallsPlugin').ApiCallsPlugin} */
      const $apiCalls = this.$apiCalls;
      const $emit = this.$emit;

      if (this.newStatus === this.dialogData.data.status) {
        return this.$alerts.info({
          title: this.$t("alerts.change-status-same-title"),
          text: this.$t("alerts.change-status-same-text")
        });
      }

      try {
        await this.$alerts.askBeforeAction({
          key: "change-status",
          settings: {
            confirmButtonColor: "red"
          },
          preConfirm: async () => {
            const result = await $apiCalls.userChangeStatus({
              id: this.$route.params.id,
              status: this.newStatus
            });

            this.$emit("accountStatusChanged", result);

            this.close();
          },
          data: {
            oldStatus: this.$t(
              "enums.AccountStatuses." + this.dialogData.data.status
            ),
            newStatus: this.$t("enums.AccountStatuses." + this.newStatus)
          }
        });
      } catch (er) {
        if (er.dismiss !== "cancel") {
          this.$alerts.error(er);
        }
      }
    }
  },
  created() {
    this.newStatus = this.dialogData?.data?.status;
  }
};
</script>

<style lang="scss">
.v-radio {
  align-items: start !important;
}
</style>
