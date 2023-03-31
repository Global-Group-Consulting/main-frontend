<template>
  <v-layout>
    <v-flex>
      <page-header
          page-name="usersId"
          :title="pageTitle"
          :sub-title="pageSubTitle"
      >
        <template v-slot:subtitle>
          <div v-if="!userIsNew">
            <div v-html="pageSubTitle" class="d-inline-block"></div>

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
            <v-menu offset-y bottom :close-on-content-click="false"
                    v-if="formData.account_status === $enums.AccountStatuses.VALIDATED">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-on="on" v-bind="attrs">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </template>

              <signing-logs-popup :userId="formData.id"></signing-logs-popup>
            </v-menu>

            <!-- Button for suspending or reactivating a user -->
            <v-tooltip bottom v-if="canSuspend">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="suspendUser"
                       :color="userIsSuspended ? 'red' : 'primary'">
                  <v-icon v-if="!userIsSuspended">mdi-account-off</v-icon>
                  <v-icon v-else>mdi-account-check</v-icon>
                </v-btn>
              </template>

              <template v-if="userIsSuspended">Riabilita utente</template>
              <template v-else>Sospendi utente</template>
            </v-tooltip>
          </div>

          <div>
            <!-- Set the user as club user -->
            <v-switch label="Utente solo Club" v-model="formData.userOnlyClub"
                      :disabled="formData.account_status !== $enums.AccountStatuses.DRAFT && !userIsNew"></v-switch>
          </div>
        </template>
      </page-header>

      <v-alert v-if="formData.contractStatus === 'declined'"
               type="error">
        {{
          $t("alerts.sign-contract-declined", {date: $options.filters.dateHourFormatter(formData.contractDeclinedAt)})
        }}
      </v-alert>

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

          <!-- Create a new Sign Request document, by cancelling the previous one.
          MNaybe i must save a reference of the create document and save it in the user data, for further use. -->
          <tooltip-btn
            :tooltip="$t('pages.usersId.btn-resend-contract-tooltip')"
            icon-name="mdi-signature-freehand"
            color="orange"
            text
            v-if="canResendContract"
            @click="askResendContract"
          >
            {{ $t("pages.usersId.btn-resend-contract") }}
          </tooltip-btn>

          <tooltip-btn
              :tooltip="$t('actions.user-profile-tooltip')"
              icon-name="mdi-card-account-details"
              text
              v-if="hasProfile && $acl.checkPermissions([UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ])"
              @click="goToUserProfile($event)"
          >
            {{ $t("actions.user-profile") }}
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

      <v-form ref="mainForm">
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
            <v-tab-item v-for="(tab, index) in formTabs" :key="index" eager>
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
                    @formDirty="updateDirtyForms($event, tab)"
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

    <user-role-change-dialog v-if="$store.getters['dialog/dialogId'] === 'UserRoleChangeDialog'"/>
  </v-layout>
</template>

<script>
import PageHeader from '../../components/blocks/PageHeader'
import DynamicFieldset from '../../components/DynamicFieldset'
import UserMessage from '../../components/dialogs/UserMessage'
import FilePreviewer from '../../components/dialogs/FilePreviewer'
import StatusChangeDialog from '../../components/dialogs/StatusChangeDialog'
import MovementsListDialog from '../../components/dialogs/MovementsListDialog'

import { kebabCase } from 'lodash'
import { onBeforeMount, reactive, ref, computed } from '@vue/composition-api'

import AccountStatuses from '../../enums/AccountStatuses'
import userDetails from '~/functions/userDetails'
import pageBasic from '~/functions/pageBasic'
import usersForm from '../../functions/usersForm'
import Permissions from '../../functions/permissions'
import SigningLogsPopup from '~/components/elements/SigningLogsPopup'
import PageToolbar from '~/components/blocks/PageToolbar'
import { UsersPermissions } from '@/functions/acl/enums/users.permissions'
import DashboardBlocks from '../../components/DashboardBlocks'
import UserRoleChangeDialog from '../../components/dialogs/UserRoleChangeDialog'
import { userFormatter } from '~/plugins/filters'

export default {
  name: '_id',
  components: {
    UserRoleChangeDialog,
    DashboardBlocks,
    PageToolbar,
    SigningLogsPopup,
    UserMessage,
    DynamicFieldset,
    PageHeader,
    FilePreviewer,
    StatusChangeDialog,
    MovementsListDialog
  },
  meta: {
    permissions: [UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_SELF_READ]
  },
  setup(props, {root, refs}) {
    const {
      $apiCalls,
      $alerts,
      $auth,
      $route,
      $i18n,
      $enums,
      $store,
      $set,
      $router
    } = root;
    const currentTab = ref(0);
    const checkedFields = ref([])
    const permissions = Permissions(root);
    const userForm = usersForm(root, refs);
    const dashboardData = reactive({
      blocks: {
        deposit: 0,
        interestAmount: 0,
        depositCollected: 0,
        interestsCollected: 0
      }
    });

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

    // Only for admin users
    const canApprove = computed(() => {
      const formData = userForm.formData.value;

      return (
          formData.account_status === AccountStatuses.DRAFT
          && (
              // the form user is admin or service client
              [$enums.UserRoles.ADMIN, $enums.UserRoles.SERV_CLIENTI].includes(formData.role)
              // the form user is userOnlyClub
              || formData.userOnlyClub
          )
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

    // Only for agents and clients that are not userOnlyClub
    const canConfirmDraftUser = computed(() => {
      const refAgent = userForm.formData.value.referenceAgent;

      return (
          !userForm.formData.value.userOnlyClub
          && (
              // auth user is the referenceAgent
              $auth.user.id === refAgent
              || (
                  // auth user is admin or service client
                  [$enums.UserRoles.AGENTE, $enums.UserRoles.ADMIN, $enums.UserRoles.SERV_CLIENTI].includes($auth.user.role)
                  // the form user an agent or a client
                  && [$enums.UserRoles.AGENTE, $enums.UserRoles.CLIENTE].includes(userForm.formData.value.role)
              )
          )
          // Accoount status is draft
          && userForm.formData.value.account_status === $enums.AccountStatuses.DRAFT
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
      return [AccountStatuses.INCOMPLETE, AccountStatuses.MUST_REVALIDATE].includes(userForm.formData.value.account_status);
    });

    const canResendContract = computed(() => {
      return [AccountStatuses.VALIDATED].includes(userForm.formData.value.account_status);
    });

    const userIsSuspended = computed(() => !!userForm.formData.value.suspended);

    const canSuspend = computed(() => [$enums.UserRoles.ADMIN, $enums.UserRoles.SERV_CLIENTI].includes($auth.user.role)
      && userForm.formData.value.account_status === $enums.AccountStatuses.ACTIVE);

    const pageTitle = computed(() => {
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

    const pageSubTitle = computed(() => {
      if (!userForm.userAccountStatus.value) {
        return "";
      }

      return $i18n.t("pages.usersId.subtitle", {
        accountState: $i18n.t(
          `enums.AccountStatuses.${
            AccountStatuses.get(userForm.userAccountStatus.value).id
          }`
        )
      });
    });

    const hasProfile = computed(() => {
        return userForm.userType.value === "user";
      }
    );

    function getFormSchema (tab) {
      const schema = userForm.formSchemas[tab.schema];

      if (!schema) {
        return tab.schema;
      }

      return schema;
    }


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
    }

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
    }

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
    }

    async function askConfirmDraftUser() {
      try {
        if (!(await userForm.onSaveClick())) {
          return
        }

        userForm.beforeConfirm.value = true

        if (!(await userForm.validateAll())) {
          return
        }

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
      } finally {
        // userForm.beforeConfirm.value = false
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

    async function askResendContract() {
      try {
        await $alerts.askBeforeAction({
          key: "resend-contract",
          preConfirm: async () => {
            const result = await $apiCalls.userResendContract(
              userForm.formData.value.id
            );
          },
          data: userForm.formData.value
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

    async function suspendUser() {
      try {
        await $alerts.askBeforeAction({
          key: userIsSuspended.value ? "unsuspend-user" : "suspend-user",
          preConfirm: async () => {
            const result = await $apiCalls.userSuspend({
              userId: userForm.formData.value.id,
              status: !userIsSuspended.value
            });

            $set(userForm.formData.value, "suspended", result.suspended)
          },
          data: userForm.formData.value
        });
      } catch (er) {
        $alerts.error(er);
      }
    }

    function goToUserProfile(event) {
      const path = "/users/profile/" + userForm.formData.value.id

      if (event.ctrlKey) {
        return window.open(path, "_blank")
      }

      $router.push(path)
    }

    const areDirtyForms = computed(() => {
      let result = false;


      for (const entry of Object.entries(userForm.dirtyForms.value)) {
        if (entry[1]) {
          result = true
        }
      }

      return result
    })

    // fetches user details
    onBeforeMount(async () => {
      const userId = $route.params.id;
      const loggedUser = $auth.user

      // TODO:: Must check if the user can see others account.

      if ($store.getters['user/userIsAdmin']) {
        if (permissions.changeAgenteRif
            || (loggedUser.hasSubAgents && userForm.formData.value.id !== loggedUser.id)
            || (userForm.userIsNew.value && permissions.userRole !== $enums.UserRoles.AGENTE)) {
          $store.dispatch('fetchAgentsList', { $apiCalls, $auth })
        }
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

        userForm.initialEmail.value = userForm.formData.value.email
        userForm.initialRole.value = userForm.formData.value.role

        /*if (userId !== "new" && [$enums.UserRoles.AGENTE, $enums.UserRoles.CLIENTE].includes(+userForm.formData.value.role)) {
          const result = await $apiCalls.dashboardFetch(userForm.formData.value.id);

          $set(dashboardData, "blocks", result.blocks);
        }*/
      } catch (er) {
        $alerts.error(er);
      }
    });

    return {
      pageTitle,
      pageSubTitle,
      currentTab,
      editMode,
      permissions,
      formData: userForm.formData,
      formTabs: userForm.formTabs,
      formSchemas: userForm.formSchemas,
      initialEmail: userForm.initialEmail,
      initialRole: userForm.initialRole,
      beforeConfirm: userForm.beforeConfirm,
      userIsNew: userForm.userIsNew,
      userRole: userForm.userRole,
      userAccountStatus: userForm.userAccountStatus,
      userIsPersonaGiuridica: userForm.userIsPersonaGiuridica,
      userBirthItaly: userForm.userBirthItaly,
      userBusinessItaly: userForm.userBusinessItaly,
      userLegalReprItaly: userForm.userLegalReprItaly,
      userType: userForm.userType,
      showReferenceAgent: userForm.showReferenceAgent,
      onSaveClick: userForm.onSaveClick,
      validateAll: userForm.validateAll,
      updateDirtyForms: userForm.updateDirtyForms,
      dirtyForms: userForm.dirtyForms,
      emailChanged: userForm.emailChanged,
      ...userDetails(root),
      getFormSchema,
      communicationsList,
      accentColor,
      canApprove,
      canChangeStatus,
      canSeeMovementsList,
      canConfirmDraftUser,
      canValidateUser,
      canResendContract,
      dashboardData,
      showIncompleteDataInfo,
      openChangeStatusDialog,
      openMovementsList,
      onAccountStatusChanged,
      onUserUpdated,
      onCheckedFieldsChange,
      askApproveUser,
      askConfirmDraftUser,
      askValidateUser,
      askIncompleteUser,
      askResendContract,
      hasProfile,
      goToUserProfile,
      areDirtyForms,
      userIsSuspended,
      suspendUser,
      canSuspend,
      UsersPermissions
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
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.areDirtyForms) {
      next()

      return
    }

    try {
      await this.$alerts.ask({
        html: this.$t("alerts.unsaved-data"),
        icon: "warning"
      })

      next()
    } catch (er) {
      return false
    }
  }
};
</script>

<style scoped></style>
