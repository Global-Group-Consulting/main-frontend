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

import { computed, ref } from '@vue/composition-api'

import usersTabs from '@/config/tabs/usersIdTabs'
import PersonTypes from '@/enums/PersonTypes'
import UserRoles from '@/enums/UserRoles'
import basicData from "../config/forms/usersDataSchema"
import usersDataSchema from '../config/forms/usersDataSchema'

export default function ({ $route }) {
  /**
   * @type {import('@vue/composition-api').Ref<Partial<import("../@types/UserFormData").UserDataSchema>>}
   */
  const formData = ref({})
  const userIsNew = computed(() => !$route.params.id)
  const userRole = computed(() => formData.value.role)
  const userBirthItaly = computed(() => (formData.value.birthCountry || '').toLowerCase() === 'it')
  const userBusinessItaly = computed(() => (formData.value.businessCountry || '').toLowerCase() === 'it')
  const userLegalReprItaly = computed(() => (formData.value.legalRepresentativeCountry || '').toLowerCase() === 'it')
  const showReferenceAgent = computed(() => [UserRoles.CLIENTE, UserRoles.AGENTE].includes(userRole))
  const userIsPersonaGiuridica = computed(() => formData.value.personType === PersonTypes.GIURIDICA)

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
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    showReferenceAgent,
  }))

  const formSchemas = Object.keys(usersDataSchema).reduce((acc, _key) => {
    acc[_key] = computed(usersDataSchema[_key])

    return acc
  }, {})


  return {
    formData,
    formTabs,
    formSchemas,
    userIsNew,
    userRole,
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    showReferenceAgent
  }
}
