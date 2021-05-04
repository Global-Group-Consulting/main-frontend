/**
 * @typedef FormContext
 * @type {{}}
 *
 * @property {Boolean} userIsNew
 * @property {Number} userRole
 * @property {Boolean} userIsPersonaGiuridica
 * @property {Boolean} userBirthItaly
 * @property {Boolean} userBusinessItaly
 * @property {Boolean} userLegalReprItaly
 * @property {Boolean} showReferenceAgent
 */

import {computed, ref, onMounted} from '@vue/composition-api'

import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'
import AccountStatuses from '../enums/AccountStatuses'
import ClubPacks from '../enums/ClubPacks'

import usersTabs from '../config/tabs/usersIdTabs'
import usersDataSchema from '../config/forms/usersDataSchema.ts'
import Permissions from './permissions'
import AgentTeamType from "~/enums/AgentTeamType";

import {kebabCase} from "lodash"

export default function ({$route, $apiCalls, $alerts, $router, $i18n, $set, $auth, $v}, refs) {
  /**
   * @type {import('@vue/composition-api').Ref<Partial<import("../@types/UserFormData").UserDataSchema>>}
   */
  const formData = ref({
    role: UserRoles.CLIENTE,
    personType: PersonTypes.FISICA,
    clubPack: ClubPacks.UNSUBSCRIBED
  })
  const initialEmail = ref("");
  const permissions = Permissions({$auth})
  const userIsNew = computed(() => $route.params.id === "new" || !formData.value.id)
  const userRole = computed(() => formData.value.role)
  const userAccountStatus = computed(() => formData.value.account_status)
  const userBirthItaly = computed(() => (formData.value.birthCountry || '').toLowerCase() === 'it')
  const userBusinessItaly = computed(() => (formData.value.businessCountry || '').toLowerCase() === 'it')
  const userLegalReprItaly = computed(() => (formData.value.legalRepresentativeCountry || '').toLowerCase() === 'it')
  const showReferenceAgent = computed(() => [UserRoles.CLIENTE, UserRoles.AGENTE].includes(userRole.value))
  const userIsPersonaGiuridica = computed(() => +formData.value.personType === PersonTypes.GIURIDICA)
  const userType = computed(() => [UserRoles.CLIENTE, UserRoles.AGENTE].includes(formData.value.role) ? "user" : "admin")
  const beforeConfirm = ref(false)
  const dirtyForms = ref({})
  const emailChanged = computed(() => initialEmail.value !== formData.value.email)


  /**
   * @type {import('@vue/composition-api').ComputedRef<{
   * userIsNew: string
   * userRole: string
   * userIsPersonaGiuridica: string
   * userBirthItaly: string
   * userBusinessItaly: string
   * userLegalReprItaly: string
   * showReferenceAgent: string
   * }>}
   */
  const formTabs = computed(() => usersTabs({
    userIsNew,
    userRole,
    userAccountStatus,
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    userType,
    showReferenceAgent,
    permissions
  }))

  const formSchemas = Object.keys(usersDataSchema).reduce((acc, _key) => {
    acc[_key] = computed(usersDataSchema[_key])

    return acc
  }, {})

  async function validateAll() {
    let result = true

    const formRefKeys = Object.keys(refs)
    const errorsList = {}

    // Recover all error messages from all forms
    for (const key of formRefKeys) {
      if (key.startsWith("dynamicForm_") && refs[key].length) {
        const errors = await refs[key][0].validate(false, true)

        if (Object.keys(errors).length > 0) {
          result = false
        }

        Object.assign(errorsList, errors)
      }
    }

    // If there are errors, show them in an alert
    if (Object.keys(errorsList).length > 0) {
      // Format messages for displaying them in an alert
      const formattedMessages = Object.entries(errorsList).reduce((acc, curr) => {
        const key = curr[0];
        const message = curr[1]

        acc.push("<strong>" + $i18n.t(`forms.${kebabCase(key)}`) + "</strong>: <em>" + message + "</em>")

        return acc
      }, [])

      $alerts.info({
        title: "",
        html: $i18n.t("alerts.invalid-form", {
          fields: formattedMessages.join("<br>")
        })
      })
    }

    return result
  }

  function resetDirtyState() {
    const formRefKeys = Object.keys(refs)

    // Recover all error messages from all forms
    for (const key of formRefKeys) {
      if (key.startsWith("dynamicForm_") && refs[key].length) {
        refs[key][0].$v?.$reset()
      }
    }

    initialEmail.value = formData.value.email
  }

  /**
   * To use in case an account is in status INCOMPLETE.
   * When saving ask the AGENT if it has corrected the invalid fields
   *
   * @returns {Promise<void>}
   */
  async function askIfDataIsComplete() {
    return await $alerts.askBeforeAction({
      key: "confirm-updated-incomplete-data",
      data: formData.value
    });
  }

  async function askIfWantToChangeEmail() {
    return await $alerts.askBeforeAction({
      key: "confirm-email-change",
      data: formData.value
    });
  }

  async function onSaveClick() {
    try {
      beforeConfirm.value = false

      const formValid = await validateAll();

      if (!formValid) {
        return
      }

      let result

      const data = {...formData.value}

      delete data.files
      delete data.referenceAgentData

      if (!data.incompleteData) {
        data.incompleteData = {}
      }

      if (formData.value.account_status === AccountStatuses.INCOMPLETE) {
        await askIfDataIsComplete()

        data.incompleteData.completed = true
      }

      if (emailChanged.value) {
        await askIfWantToChangeEmail()

        data.incompleteData.completed = true
      }

      if (userIsNew.value) {
        result = await $apiCalls.userCreate(data)
        $router.replace("/users/" + result.id)
      } else {
        result = await $apiCalls.userUpdate(data)

        if ($auth.user.id === result.id) {
          $auth.setUser(result)
        }

        $set(formData, "value", result)
      }

      $alerts.toastSuccess("user-update-success")

      resetDirtyState()

      return true
    } catch (error) {
      $alerts.error(error)
    }
  }

  function updateDirtyForms(state, tab) {
    $set(dirtyForms.value, tab.title, state)
  }

  return {
    formData,
    formTabs,
    formSchemas,
    initialEmail,
    beforeConfirm,
    userIsNew,
    userRole,
    userAccountStatus,
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    userType,
    showReferenceAgent,
    onSaveClick,
    permissions,
    validateAll,
    updateDirtyForms,
    dirtyForms,
    emailChanged
  }
}
