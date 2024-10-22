import { computed } from "@vue/composition-api";
import UserRoles from "../../enums/UserRoles";

export default function (formContext) {
  const userType = computed(() => [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+formContext.userRole.value) ? 'admin' : 'user')
  const userIsAgent = computed(() => +formContext.userRole.value === UserRoles.AGENTE)
  const userOnlyClub = computed(() => formContext.formData.value.userOnlyClub)

  return [
    {
      title: 'user-data',
      cardTitle: 'user-data',
      schema: "basicData"
    },
    /*{
      title: `user-${formContext.userIsPersonaGiuridica.value ? 'legal-' : ''}residence`,
      cardTitle: `user-${formContext.userIsPersonaGiuridica.value ? 'legal-' : ''}residence`,
      schema: "addressData"
    },*/
   /* {
      title: 'contacts',
      cardTitle: 'contacts',
      schema: "contactsData"
    },*/
    {
      title: 'contract',
      cardTitle: 'contract',
      schema: "contractData",
      if: userType.value === 'user' && !userOnlyClub.value
    },
    {
      title: 'agent',
      cardTitle: 'agent',
      schema: "agentData",
      if: userIsAgent.value
    },
    {
      title: 'club',
      cardTitle: 'club',
      schema: "clubData",
      if: userType.value === "user"
    },
    {
      title: 'other',
      cardTitle: 'other',
      schema: "extraData"
    }
  ].filter(_entry => typeof _entry.if === 'boolean' ? _entry.if : true)
}
