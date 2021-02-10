<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="pageData.title.value"
        :subtitle="!userIsNew ? pageData.subtitle.value : ''"
        :icon="pageData.icon.value"
      >
        <template v-slot:subtitle v-if="!userIsNew">
          <div v-html="pageData.subtitle.value" class="d-inline-block"></div>

          <!-- <v-tooltip bottom v-if="canChangeStatus">
            <template v-slot:activator="{ on }">
              <v-btn icon dark @click="openChangeStatusDialog" v-on="on">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>

            <span>Modifica stato</span>
          </v-tooltip> -->

          <!-- Incomplete data info -->
          <v-menu offset-y open-on-hover bottom
                  v-if="showIncompleteDataInfo"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs">
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </template>

            <v-card color="white" max-width="400px" flat>
              <v-card-text>
                {{ $t("pages.usersId.info-incomplete-data") }}

                <template v-if="formData.incompleteData && formData.incompleteData.message">
                  <v-layout align-items-start class="mt-2">
                    <strong>
                      {{ $t('pages.usersId.info-incomplete-data-message') }}
                    </strong>
                    <div class="ml-2">
                      {{ formData.incompleteData.message }}
                    </div>
                  </v-layout>
                </template>

                <template
                  v-if="formData.incompleteData && formData.incompleteData.checkedFields && formData.incompleteData.checkedFields.length > 0">
                  <v-layout align-items-start class="mt-2">
                    <strong>
                      {{ $t('pages.usersId.info-incomplete-data-fields') }}
                    </strong>
                    <div class="ml-2">
                      <div v-for="field of formData.incompleteData.checkedFields">
                        {{ $t(`forms.${$options.filters.formFieldNameFormatter(field)}`) }}
                      </div>
                    </div>
                  </v-layout>
                </template>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- Contract status -->
          <v-menu offset-y open-on-hover bottom
                  v-if="formData.account_status === $enums.AccountStatuses.VALIDATED">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs">
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </template>

            <signing-logs-popup :value="formData.signinLogs"></signing-logs-popup>
          </v-menu>
        </template>
      </page-header>

      <page-toolbar>
        <template slot="left-block">
          <tooltip-btn
            v-if="permissions.seeOtherUsers"
            :tooltip="$t('pages.usersId.btn-go-back-tooltip')"
            icon
            icon-name="mdi-arrow-left"
            @click="$router.push('/users')"
          >
          </tooltip-btn>
        </template>

        <template slot="center-block">

          <!-- approve a user and change the status to "APPROVED" -->
          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-approve-tooltip')"
            icon-name="mdi-check"
            color="green"
            text
            v-if="canApprove"
            @click="askApproveUser"
          >
            {{ $t("pages.usersId.btn-approve") }}
          </tooltip-btn>

          <!-- Set the user status to CREATED -->
          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-confirm-draft-user-tooltip')"
            icon-name="mdi-account-check"
            color="green"
            text
            v-if="canConfirmDraftUser"
            @click="askConfirmDraftUser"
          >
            {{ $t("pages.usersId.btn-confirm-draft-user" + (userType === 'admin' ? '-admin' : '')) }}
          </tooltip-btn>

          <!-- Set as VALIDATED a user that is in status CREATED -->
          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-validate-user-tooltip')"
            icon-name="mdi-account-check"
            color="green"
            text
            v-if="canValidateUser"
            @click="askValidateUser"
          >
            {{ $t("pages.usersId.btn-validate-user") }}
          </tooltip-btn>

          <!-- Set as INCOMPLETE a user that is in status CREATED -->
          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-incomplete-user-tooltip')"
            icon-name="mdi-account-alert"
            color="red"
            text
            v-if="canValidateUser"
            @click="askIncompleteUser"
          >
            {{ $t("pages.usersId.btn-incomplete-user") }}
          </tooltip-btn>

        </template>

        <template slot="right-block">
          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-movements-list')"
            icon-name="mdi-view-list"
            text
            @click="openMovementsList"
            v-if="canSeeMovementsList"
          >
            {{ $t("pages.usersId.btn-movements-list") }}
          </tooltip-btn>

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
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </page-toolbar>

      <v-form>
        <v-tabs
          v-model="currentTab"
          center-active
          show-arrows
          class="ml-3"
        >
          <v-tab
            v-for="(section, index) in formTabs"
            :key="index"
            :title="'pages.usersId.tabs.' + section.title"
            :disabled="userIsNew"
          >
            {{ $t("pages.usersId.tabs." + section.title) }}
          </v-tab>
        </v-tabs>

        <v-card>
          <v-tabs-items v-model="currentTab">
            <v-tab-item v-for="(tab, index) in formTabs" :key="index">
              <v-card elevation="0">
                <v-card-text>
                  <dynamic-fieldset
                    :schema="getFormSchema(tab)"
                    v-model="formData"
                    :invalidFields="formData.incompleteData ? formData.incompleteData.checkedFields : []"
                    :ref="'dynamicForm_' + index"
                    :edit-mode="editMode"
                    @status="saveStatus(tab.schema, $event)"
                    @checkedFieldsChange="onCheckedFieldsChange"
                  />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-card-actions>
            <v-btn @click="goBack" v-if="currentTab > 0" text rounded>
              <v-icon>mdi-chevron-left</v-icon>
              {{ $t("pages.usersId.btn-previous") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              dark
              rounded
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
              >mdi-chevron-right
              </v-icon
              >
              <v-icon v-else class="ml-2">mdi-content-save</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>


        <!-- Floating action button -->
        <v-fab-transition v-if="!userIsNew && currentTab < formTabs.length - 1 && $vuetify.breakpoint.smAndUp">
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
                :loading="gLoading"
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

    <movements-list-dialog
      v-if="$store.getters['dialog/dialogId'] === 'MovementsListDialog'"
      @userUpdated="onUserUpdated"
    ></movements-list-dialog>
  </v-layout>
</template>

<script>
import PageHeader from "@/components/blocks/PageHeader";
import DynamicFieldset from "@/components/DynamicFieldset";
import UserMessage from "../../components/dialogs/UserMessage";
import FilePreviewer from "../../components/dialogs/FilePreviewer";
import StatusChangeDialog from "../../components/dialogs/StatusChangeDialog";
import MovementsListDialog from "../../components/dialogs/MovementsListDialog";

import {kebabCase} from "lodash"
import {onBeforeMount, reactive, ref, computed} from "@vue/composition-api";

import AccountStatuses from "../../enums/AccountStatuses.js";
import UserRoles from "@/enums/UserRoles.js";
import userDetails from "@/functions/userDetails";
import pageBasic from "@/functions/pageBasic";
import usersForm from "../../functions/usersForm";
import Permissions from "@/functions/permissions";
import SigningLogsPopup from "@/components/elements/SigningLogsPopup";
import PageToolbar from "@/components/blocks/PageToolbar";

export default {
  name: "_id",
  components: {
    PageToolbar,
    SigningLogsPopup,
    UserMessage,
    DynamicFieldset,
    PageHeader,
    FilePreviewer,
    StatusChangeDialog,
    MovementsListDialog
  },
  middleware: ["pagesAuth"],
  setup(props, {root, refs}) {
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
    const checkedFields = ref([])
    const permissions = Permissions(root);

    const userForm = usersForm(root, refs);

    const editMode = computed(() =>
      !userForm.userIsNew.value &&
      userForm.userRole.value === $enums.UserRoles.CLIENTE &&
      permissions.userRole === $enums.UserRoles.SERV_CLIENTI &&
      [AccountStatuses.CREATED, AccountStatuses.MUST_REVALIDATE].includes(
        userForm.userAccountStatus.value
      )
    );

    const pageData = pageBasic(root, "usersId");

    const accentColor = computed(
      () => $enums.UserRoles.get(userForm.userRole.value).color
    );

    const canApprove = computed(() => {
      const formData = userForm.formData.value;

      return (
        (formData.account_status === AccountStatuses.DRAFT &&
          permissions.superAdmin)
      );
    });

    const canChangeStatus = computed(() => {
      return (
        permissions.changeState &&
        $auth.user.id !== userForm.formData.value.id &&
        userForm.formData.value.account_status !== $enums.AccountStatuses.ACTIVE
      );
    });

    const canSeeMovementsList = computed(() => {
      return (
        !userForm.userIsNew.value &&
        permissions.userType === "admin" &&
        [$enums.UserRoles.CLIENTE, $enums.UserRoles.AGENTE].includes(
          userForm.formData.value.role
        )
      );
    });

    const canConfirmDraftUser = computed(() => {
      const refAgent = userForm.formData.value.referenceAgent;

      return (
        ($auth.user.id === refAgent) &&
        userForm.formData.value.account_status === $enums.AccountStatuses.DRAFT
      );
    });

    const canValidateUser = computed(() => {
      return $auth.user.role === $enums.UserRoles.SERV_CLIENTI &&
        [$enums.AccountStatuses.CREATED, $enums.AccountStatuses.MUST_REVALIDATE].includes(userForm.formData.value.account_status)
    })

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

    const showIncompleteDataInfo = computed(() => {
      return [AccountStatuses.INCOMPLETE, AccountStatuses.MUST_REVALIDATE].includes(userForm.formData.value.account_status)
    })

    function getFormSchema(tab) {
      const schema = userForm.formSchemas[tab.schema];

      if (!schema) {
        return tab.schema;
      }

      return schema;
    };


    function openChangeStatusDialog() {
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

    function openMovementsList() {
      root.$store.dispatch("dialog/updateStatus", {
        title: $i18n.t("dialogs.movementsList.title"),
        id: "MovementsListDialog",
        fullscreen: false,
        large: true,
        readonly: true,
        texts: {
          cancelBtn: "dialogs.movementsList.btn-cancel"
        },
        data: {
          user: userForm.formData.value
        }
      });
    };

    function onAccountStatusChanged(userData) {
      $set(userForm.formData.value, "account_status", userData.account_status);
    }

    function onUserUpdated(userData) {
      $set(userForm.formData, "value", userData);
    }

    function onCheckedFieldsChange() {
      const newValue = []

      for (const formKey in refs) {
        const fieldsArray = refs[formKey][0].checkedFields

        if (fieldsArray && fieldsArray.length > 0) {
          newValue.push(...fieldsArray)
        }
      }

      root.$set(checkedFields, "value", newValue)
    }

    const sendEmailActivation = async function () {
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

    async function askApproveUser() {
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

    async function askConfirmDraftUser() {
      try {
        await $alerts.askBeforeAction({
          key: "confirm-draft-user",
          preConfirm: async () => {
            const result = await $apiCalls.userConfirmDraft(
              userForm.formData.value.id
            );

            userForm.formData.value.account_status = result.account_status
          },
          data: userForm.formData.value
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

    async function askValidateUser() {
      try {
        await $alerts.askBeforeAction({
          key: "validate-user",
          preConfirm: async () => {
            const result = await $apiCalls.userValidate(
              userForm.formData.value.id
            );

            userForm.formData.value.account_status = result.account_status
          },
          data: userForm.formData.value
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

    async function askIncompleteUser() {
      try {
        const alertText = [root.$t("alerts.incomplete-user-text")]

        if (checkedFields.value.length > 0) {
          alertText.push("<br>" + root.$t("alerts.incomplete-user-text-fields", {
            fieldsList: checkedFields.value.map(_field => "- " + root.$t("forms." + kebabCase(_field))).join("<br>")
          }))
        }

        await $alerts.askBeforeAction({
          key: "incomplete-user",
          settings: {
            width: "600px",
            input: "textarea",
            inputLabel: root.$t("alerts.incomplete-user-textarea-label"),
            inputPlaceholder: root.$t("alerts.incomplete-user-textarea-placeholder"),
            inputValidator: async (value) => {
              if (checkedFields.value.length === 0 && !value) {
                return root.$t("alerts.incomplete-user-textarea-validation")
              }
            },
            html: alertText.join("<br>")
          },
          preConfirm: async (userInput) => {

            const result = await $apiCalls.userIncomplete({
              userId: userForm.formData.value.id,
              message: userInput,
              checkedFields: checkedFields.value,
            });

            userForm.formData.value.account_status = result.account_status
            userForm.formData.value.incompleteData = result.incompleteData
          },
          data: userForm.formData.value
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

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
    onBeforeMount(async () => {
      const userId = $route.params.id;

      if (permissions.changeAgenteRif || (userForm.userIsNew.value && permissions.userRole !== $enums.UserRoles.AGENTE)) {
        $store.dispatch("fetchAgentsList", {$apiCalls, $auth});
      }

      if (userId === "new") {
        userForm.formData.value.role =
          +$route.query.type || $enums.UserRoles.CLIENTE;

        if ($auth.user.role === $enums.UserRoles.AGENTE) {
          userForm.formData.value.referenceAgent = $auth.user.id;
          userForm.formData.value.referenceAgentData = $auth.user;
        }

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
      canSeeMovementsList,
      canConfirmDraftUser,
      canValidateUser,
      showIncompleteDataInfo,
      permissions,
      openChangeStatusDialog,
      openMovementsList,
      onAccountStatusChanged,
      onUserUpdated,
      onCheckedFieldsChange,
      askApproveUser,
      askConfirmDraftUser,
      askValidateUser,
      askIncompleteUser
    };
  },
  computed: {},
  methods: {
    saveStatus() {
    },
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
