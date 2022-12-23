<template>
  <div>
    <portal to="dialog-content">
      <template v-if="!loading">
        <v-alert :type="contractImported ? 'success' : 'warning'"
                 outlined class="text-center mt-3"
                 v-if="canImportContract && (!user.contractFiles || user.contractFiles.length === 0)">
          <template v-if="!contractImported">
            {{ $t("dialogs.movementsList.alert-no-contract", user) }}

            <div class="d-flex justify-center">
              <file-uploader
                class="flex-fill"
                style="max-width: 400px"
                @change="contractToImport = $event"
                accept=".pdf"
                :placeholder="$t('dialogs.movementsList.file-placeholder')"
              ></file-uploader>
            </div>

            <v-btn
              text
              outlined
              @click="onImportContractClick(contractToImport)"
              :disabled="!contractToImport"
            >
              {{ $t("dialogs.movementsList.btn-import-contract") }}
            </v-btn>
          </template>
          <template v-else>
            {{ $t("dialogs.movementsList.alert-import-contract-success") }}
          </template>
        </v-alert>

        <v-alert
          :type="listImported ? 'success' : 'info'"
          class="text-center"
          outlined
          v-if="canImportMovements"
        >
          <template v-if="!listImported">
            {{ $t("dialogs.movementsList.alert-no-data", user) }}
          </template>

          <template v-if="canImportMovements && !listImported">
            <p class="mt-2" v-html="$t('dialogs.movementsList.alert-import-data', user)"/>

            <div class="d-flex justify-center">
              <file-uploader
                class="flex-fill"
                style="max-width: 400px"
                @change="fileToImport = $event"
                accept=".csv"
                :placeholder="$t('dialogs.movementsList.file-placeholder')"
              ></file-uploader>
            </div>

            <v-btn
              text
              outlined
              @click="onImportListClick(fileToImport)"
              :disabled="!fileToImport"
            >
              {{ $t("dialogs.movementsList.btn-import") }}
            </v-btn>
          </template>

          <template v-if="canImportMovements && listImported">
            {{ $t("dialogs.movementsList.alert-import-success") }}
          </template>
        </v-alert>

        <movements-list-table
          :userId="user.id"
          v-if="movements.list.value.length > 0"
        ></movements-list-table>
      </template>

      <template v-else>
        <v-skeleton-loader type="table-thead, table-tbody "></v-skeleton-loader>
      </template>
    </portal>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex-composition-helpers";
import {onBeforeMount, ref} from "@vue/composition-api";

import MovementsListTable from "@/components/table/MovementsListTable.vue";
import FileUploader from "@/components/forms/inputs/FileUploader";

import MovementsFn from "@/functions/movementsFn.js";
import UserRoles from "@/enums/UserRoles";
import AccountStatuses from "../../enums/AccountStatuses";

export default {
  components: {MovementsListTable, FileUploader},
  setup(props, {root, emit}) {
    const {$auth, $alerts, $apiCalls, $i18n} = root;
    const {useGetters: dialogUseGetters} = createNamespacedHelpers("dialog");
    const {dialogData} = dialogUseGetters(["dialogData"]);
    const movementsFn = MovementsFn(root);
    const fileToImport = ref(null);
    const contractToImport = ref(null);
    const listImported = ref(false);
    const contractImported = ref(false);
    const loading = ref(true);
    const user = dialogData.value.data.user;

    const canImportMovements = [
      UserRoles.SERV_CLIENTI,
      UserRoles.ADMIN
    ].includes(+$auth.user.role) && user.account_status === AccountStatuses.DRAFT; //$auth.user.superAdmin;

    const canImportContract = [
      UserRoles.SERV_CLIENTI,
      UserRoles.ADMIN
    ].includes(+$auth.user.role) && user.account_status === AccountStatuses.DRAFT;

    async function onImportContractClick(file) {
      try {
        await $alerts.askBeforeAction({
          key: "contract-import",
          preConfirm: async () => {
            const result = await $apiCalls.importContract({
              fileToImport: file,
              userId: user.id
            });

            // store the received data in the current list so that can be shown to the user
            // root.$set(movementsFn.list, "value", result);

            emit("userUpdated", result)

            contractImported.value = true;
          }
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

    async function onImportListClick(file) {
      let overwrite = false

      try {
        if(movementsFn.list.value.length > 0){
          await $alerts.ask({
            type: "warning",
            title: "ATTENZIONE!!!",
            html: $i18n.t("dialogs.movementsList.alert-overwrite-movements"),
            confirmButtonText: $i18n.t("dialogs.movementsList.btn-overwrite"),
          });

          overwrite = true
        }

        await $alerts.askBeforeAction({
          key: "movements-import",
          preConfirm: async () => {
            const result = await $apiCalls.movementApi.importMovementsList({
              fileToImport: file,
              userId: user.id,
              overwrite
            });

            // store the received data in the current list so that can be shown to the user
            root.$set(movementsFn.list, "value", []);
            root.$set(movementsFn.list, "value", result);

            listImported.value = true;
          }
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

    onBeforeMount(async () => {
      await movementsFn.fetchList(dialogData.value.data.user.id);

      setTimeout(() => {
        loading.value = false;
      }, 150);
    });

    return {
      movements: movementsFn,
      onImportContractClick,
      onImportListClick,
      canImportMovements,
      canImportContract,
      user,
      fileToImport,
      contractToImport,
      listImported,
      contractImported,
      loading
    };
  }
};
</script>

<style></style>
