import { computed, ref } from '@vue/composition-api'

import usersTabs from '@/config/tabs/usersIdTabs'
import PersonTypes from '@/enums/PersonTypes'
import UserRoles from '@/enums/UserRoles'

export default function ({ $route }) {
  const formData = ref({})
  const userIsNew = computed(() => !$route.params.id)
  const userRole = computed(() => formData.value.role)
  const userBirthItaly = computed(() => (formData.value.birthCountry || '').toLowerCase() === 'it')
  const userBusinessItaly = computed(() => (formData.value.businessCountry || '').toLowerCase() === 'it')
  const userLegalReprItaly = computed(() => (formData.value.legalRepresentativeCountry || '').toLowerCase() === 'it')
  const showReferenceAgent = computed(() => [UserRoles.CLIENTE, UserRoles.AGENTE].includes(userRole))
  const userIsPersonaGiuridica = formData.value.tipoSoggetto === PersonTypes.GIURIDICA

  const formTabs = computed(() => usersTabs({
    userIsNew,
    userRole,
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    showReferenceAgent
  }))

  return {
    formData,
    formTabs,
    userIsNew,
    userRole,
    userIsPersonaGiuridica,
    userBirthItaly,
    userBusinessItaly,
    userLegalReprItaly,
    showReferenceAgent
  }
}
