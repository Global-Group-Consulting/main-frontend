import UserRoles from "../enums/UserRoles"
import {computed, reactive} from "@vue/composition-api";

export default function ({$auth}) {
  const userGold = computed(() => $auth.user.gold)

  /**
   * @type {import("@vue/composition-api").ComputedRef<number>}
   */
  const userRole = computed(() => $auth.user.role)

  /**
   * @type {import("@vue/composition-api").ComputedRef<boolean>}
   */
  const superAdmin = computed(() => !!$auth.user.superAdmin)

  /**
   * @type {import("@vue/composition-api").ComputedRef<"user" | "admin">}
   */
  const userType = computed(() => [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+userRole.value) ? "admin" : "user")

  const seeAllUsers = computed(() => userType.value === "admin")
  const seeOwnUsers = computed(() => userRole.value === UserRoles.AGENTE)

  const permissions = reactive({
    userRole,
    userType,
    superAdmin,
    addUsers: computed(() => userRole.value !== UserRoles.CLIENTE),
    addUsers_admin: computed(() => !!superAdmin.value),
    addUsers_servClienti: computed(() => !!superAdmin.value),
    addUsers_agente: computed(() => userType.value === "admin" && !!superAdmin.value),
    addUsers_cliente: computed(() => userRole.value !== UserRoles.CLIENTE),
    addRequest: computed(() => userType.value === "user"),
    addRequestGold: computed(() => userType.value === "user" && userGold.value),
    changeRole: computed(() => !!superAdmin.value),
    changeState: computed(() => !!superAdmin.value),
    changeAgenteRif: computed(() => userType.value === "admin"),
    deleteUser: computed(() => !!superAdmin.value),
    seeSuperAdmins: computed(() => !!superAdmin.value),
    seeAllUsers,
    seeOwnUsers,
    seeOtherUsers: computed(() => seeAllUsers.value || seeOwnUsers.value)
  })

  return permissions
}
