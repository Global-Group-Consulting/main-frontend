<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="pageData.title.value"
        :subtitle="pageData.subtitle.value"
        :icon="pageData.icon.value"
      >
        <template v-slot:subtitle v-if="canChangeStatus">
          <div v-html="pageData.subtitle.value" class="d-inline-block"></div>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon dark @click="openChangeStatusDialog" v-on="on">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>

            <span>Modifica stato</span>
          </v-tooltip>
        </template>
      </page-header>

      <v-toolbar class="mb-5">
        <v-toolbar-items class="flex-fill">
          <tooltip-btn
            v-if="permissions.seeOtherUsers"
            :tooltip="$t('pages.usersId.btn-go-back-tooltip')"
            icon
            icon-name="mdi-arrow-left"
            @click="$router.push('/users')"
          >
          </tooltip-btn>

          <v-spacer></v-spacer>

          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-approve-tooltip')"
            icon-name="mdi-check"
            color="green"
            text
            v-if="canApprove"
            @click="approveUser"
          >
            {{ $t("pages.usersId.btn-approve") }}
          </tooltip-btn>

          <!-- <tooltip-btn
            :tooltip="$t('pages.usersId.btn-send-activation-email-tooltip')"
            icon-name="mdi-at"
            text
            v-if="!formData.accountVerifiedAt && !userIsNew"
          >
            {{ $t("pages.usersId.btn-send-activation-email") }}
          </tooltip-btn>

          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-reset-password-tooltip')"
            icon-name="mdi-lock-reset"
            v-if="formData.accountVerifiedAt && !userIsNew"
            text
          >
            {{ $t("pages.usersId.btn-reset-password") }}
          </tooltip-btn>

          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-send-email-tooltip')"
            icon-name="mdi-email-plus"
            text
            @click="onSendEmail"
            v-if="!userIsNew"
          >
            {{ $t("pages.usersId.btn-send-email") }}
          </tooltip-btn> -->

          <v-spacer></v-spacer>

          <v-menu offset-y v-if="communicationsList.length > 0">
            <template v-slot:activator="{ on: on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on" small text>
                <v-icon>mdi-email-multiple-outline</v-icon>
                <v-icon class="ml-2">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in communicationsList"
                :key="index"
                @click="item.click"
              >
                <v-list-item-title>{{
                  $t("menus." + item.value)
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>

      <v-form>
        <v-card>
          <v-tabs
            v-model="currentTab"
            :background-color="accentColor"
            center-active
            dark
            show-arrows
          >
            <v-tab
              v-for="(section, index) in formTabs"
              :key="index"
              :title="'pages.usersId.tabs.' + section.title"
            >
              {{ $t("pages.usersId.tabs." + section.title) }}
            </v-tab>
          </v-tabs>

          <div>
            <v-tabs-items v-model="currentTab">
              <v-tab-item v-for="(tab, index) in formTabs" :key="index">
                <v-card elevation="0">
                  <!-- <v-card-title>{{
                    $t("pages.usersId.tabs." + tab.cardTitle)
                  }}</v-card-title> -->

                  <v-card-text>
                    <dynamic-fieldset
                      :schema="getFormSchema(tab)"
                      v-model="formData"
                      :ref="'dynamicForm_' + index"
                      @status="saveStatus(tab.schema, $event)"
                      :edit-mode="editMode"
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>

            <v-card-actions>
              <v-btn @click="goBack" v-if="currentTab > 0" text>
                <v-icon>mdi-chevron-left</v-icon>
                {{ $t("pages.usersId.btn-previous") }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                dark
                :color="
                  currentTab < formTabs.length - 1 ? accentColor : 'success'
                "
                @click="
                  currentTab < formTabs.length - 1 ? goNext() : onSaveClick()
                "
              >
                {{
                  $t(
                    `pages.usersId.btn-${
                      currentTab < formTabs.length - 1 ? "next" : "save"
                    }`
                  )
                }}
                <v-icon v-if="currentTab < formTabs.length - 1"
                  >mdi-chevron-right</v-icon
                >
                <v-icon v-else class="ml-2">mdi-content-save</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>

        <!-- Floating action button -->
        <v-fab-transition v-if="!userIsNew && currentTab < formTabs.length - 1">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                slot="activator"
                v-on="on"
                color="green"
                fixed
                dark
                bottom
                right
                fab
                type="button"
                @click="onSaveClick"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("pages.usersId.btn-save") }}</span>
          </v-tooltip>
        </v-fab-transition>
      </v-form>
    </v-flex>

    <user-message
      v-if="$store.getters['dialog/dialogId'] === 'UserMessage'"
    ></user-message>

    <file-previewer
      v-if="$store.getters['dialog/dialogId'] === 'FilePreviewer'"
    ></file-previewer>

    <status-change-dialog
      v-if="$store.getters['dialog/dialogId'] === 'StatusChangeDialog'"
      @accountStatusChanged="onAccountStatusChanged"
    ></status-change-dialog>
  </v-layout>
</template>

<script>
import PageHeader from "@/components/blocks/PageHeader";
import DynamicFieldset from "@/components/DynamicFieldset";
import UserMessage from "../../components/dialogs/UserMessage";
import FilePreviewer from "../..//components/dialogs/FilePreviewer";
import StatusChangeDialog from "../..//components/dialogs/StatusChangeDialog";

import { onMounted, reactive, ref, computed } from "@vue/composition-api";

import AccountStatuses from "../../enums/AccountStatuses.js";
import UserRoles from "@/enums/UserRoles.js";
import userDetails from "@/functions/userDetails";
import pageBasic from "@/functions/pageBasic";
import usersForm from "../../functions/usersForm";
import Permissions from "@/functions/permissions";

export default {
  name: "_id",
  components: {
    UserMessage,
    DynamicFieldset,
    PageHeader,
    FilePreviewer,
    StatusChangeDialog
  },
  middleware: ["pagesAuth"],
  setup(props, { root }) {
    const {
      $apiCalls,
      $alerts,
      $auth,
      $route,
      $i18n,
      $enums,
      $store,
      $set
    } = root;
    const currentTab = ref(0);
    const permissions = Permissions(root);
    const userForm = usersForm(root);

    const editMode = computed(
      () =>
        !userForm.userIsNew.value &&
        userForm.userRole.value === $enums.UserRoles.CLIENTE &&
        permissions.userType === "admin"
    );

    const pageData = pageBasic(root, "usersId");

    const accentColor = computed(
      () => $enums.UserRoles.get(userForm.userRole.value).color
    );

    const canApprove = computed(() => {
      const formData = userForm.formData.value;

      return (
        formData.account_status === AccountStatuses.VALIDATED ||
        (formData.account_status === AccountStatuses.DRAFT &&
          [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+formData.role))
      );
    });

    const canChangeStatus = computed(() => {
      return (
        permissions.changeState &&
        $auth.user.id !== userForm.formData.id &&
        userForm.formData.account_status !== $enums.AccountStatuses.ACTIVE
      );
    });

    const getFormSchema = function(tab) {
      const schema = userForm.formSchemas[tab.schema];

      if (!schema) {
        return tab.schema;
      }

      return schema;
    };

    const approveUser = async function() {
      try {
        await $alerts.askBeforeAction({
          key: "approve-user",
          preConfirm: async () => {
            const result = await $apiCalls.userApprove(
              userForm.formData.value.id
            );
            userForm.formData.value.account_status = result.account_status;
          },
          data: userForm.formData.value
        });
      } catch (er) {
        $alerts.error(er);
      }
    };

    const openChangeStatusDialog = function() {
      root.$store.dispatch("dialog/updateStatus", {
        title: $i18n.t("dialogs.statusChange.title", {
          status: $i18n.t(
            "enums.AccountStatuses." + userForm.formData.value.account_status
          )
        }),
        id: "StatusChangeDialog",
        fullscreen: false,
        data: {
          status: userForm.formData.value.account_status,
          userRole: userForm.formData.value.role
        }
      });
    };

    const onAccountStatusChanged = function(userData) {
      $set(userForm.formData.value, "account_status", userData.account_status);
    };

    const sendEmailActivation = async function() {
      try {
        await $alerts.askBeforeAction({
          key: "send-email-activation",
          preConfirm: async () => {
            const result = await $apiCalls.userSendEmailActivation(
              userForm.formData.value.id
            );
          }
        });
      } catch (er) {
        $alerts.error(er);
      }
    };

    const communicationsList = computed(() => {
      return [
        {
          value: "sendEmailActivation",
          click: sendEmailActivation,
          if: computed(
            () =>
              userForm.formData.value.account_status ===
              AccountStatuses.APPROVED
          )
        },
        {
          value: "sendEmailForgot",
          if: false
        }
      ].filter(_item => (_item.if === undefined ? true : _item.if.value));
    });

    pageData.title = computed(() => {
      if (userForm.userIsNew.value) {
        return $i18n.t(`pages.usersId.title-new-with-role`, {
          role: $i18n.t(
            "enums.UserRoles." +
              $enums.UserRoles.getIdName(userForm.userRole.value)
          )
        });
      }

      return $i18n.t(`pages.usersId.title`);
    });

    pageData.subtitle = computed(() => {
      return $i18n.t("pages.usersId.subtitle", {
        accountState: $i18n.t(
          `enums.AccountStatuses.${
            AccountStatuses.get(userForm.userAccountStatus.value).id
          }`
        )
      });
    });

    // fetches user details
    onMounted(async () => {
      const userId = $route.params.id;

      $store.dispatch("fetchAgentsList", { $apiCalls });

      if (userId === "new") {
        userForm.formData.value.role =
          +$route.query.type || $enums.UserRoles.CLIENTE;

        return;
      }

      try {
        userForm.formData.value = await $apiCalls.fetchUserDetails(
          $route.params.id
        );
      } catch (er) {
        $alerts.error(er);
      }
    });

    return {
      currentTab,
      editMode,
      getFormSchema,
      ...userForm,
      ...userDetails(root),
      pageData,
      communicationsList,
      accentColor,
      canApprove,
      canChangeStatus,
      approveUser,
      permissions,
      openChangeStatusDialog,
      onAccountStatusChanged
    };
  },
  computed: {},
  methods: {
    saveStatus() {},
    async goNext() {
      const formValid = await this.$refs[
        `dynamicForm_${this.currentTab}`
      ][0].validate();

      // If there form is invalid, don't proceed
      if (!formValid) {
        return;
      }

      this.currentTab += 1;
    },
    goBack() {
      this.currentTab -= 1;
    },
    onSendEmail() {
      this.$store.dispatch("dialog/updateStatus", {
        title: this.$t("dialogs.userMessage.title")
      });
    }
  }
};
</script>

<style scoped></style>
