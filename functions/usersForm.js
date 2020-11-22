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

import { computed, ref, onMounted } from '@vue/composition-api'

import PersonTypes from '../enums/PersonTypes'
import UserRoles from '../enums/UserRoles'

import usersTabs from '../config/tabs/usersIdTabs'
import usersDataSchema from '../config/forms/usersDataSchema'
import Permissions from './permissions'

export default function ({ $route, $apiCalls, $alerts, $router, $i18n, $set, $auth }, refs) {
  /**
   * @type {import('@vue/composition-api').Ref<Partial<import("../@types/UserFormData").UserDataSchema>>}
   */
  const formData = ref({
    role: UserRoles.CLIENTE,
    personType: PersonTypes.FISICA
  })
  const permissions = Permissions({ $auth })
  const userIsNew = computed(() => $route.params.id === "new" || !formData.value.id)
  const userRole = computed(() => formData.value.role)
  const userAccountStatus = computed(() => formData.value.account_status)
  const userBirthItaly = computed(() => (formData.value.birthCountry || '').toLowerCase() === 'it')
  const userBusinessItaly = computed(() => (formData.value.businessCountry || '').toLowerCase() === 'it')
  const userLegalReprItaly = computed(() => (formData.value.legalRepresentativeCountry || '').toLowerCase() === 'it')
  const showReferenceAgent = computed(() => [UserRoles.CLIENTE, UserRoles.AGENTE].includes(userRole.value))
  const userIsPersonaGiuridica = computed(() => +formData.value.personType === PersonTypes.GIURIDICA)

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
    showReferenceAgent,
    permissions
  }))

  const formSchemas = Object.keys(usersDataSchema).reduce((acc, _key) => {
    acc[_key] = computed(usersDataSchema[_key])

    return acc
  }, {})

  async function validateAll() {
    let result = true

    for (const key of Object.keys(refs)) {
      if (key.startsWith("dynamicForm_")) {
        const valid = await refs[key][0].validate()

        if (!valid) {
          result = false
        }
      }
    }

    return result
  }

  async function onSaveClick() {
    try {
      const formValid = await validateAll();

      if (!formValid) {
        return
      }

      let result

      delete formData.value.files

      if (userIsNew.value) {
        result = await $apiCalls.userCreate(formData.value)
        $router.replace("/users/" + result.id)
      } else {
        result = await $apiCalls.userUpdate(formData.value)

        $set(formData, "value", result)
      }

      $alerts.toastSuccess("user-update-success")
    } catch (error) {
      $alerts.error(error)
    }
  }

  return {
    formData,
    formTabs,
    formSchemas,
    userIsNew,
    userRole,
    userAccountStatus,
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    showReferenceAgent,
    onSaveClick,
    permissions
  }
}
