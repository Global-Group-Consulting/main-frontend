import { AuthPlugin } from "./AuthPlugin"
import { ApiCallsPlugin } from "./ApiCallsPlugin"
import { I18n } from "./I18nPlugin";
import { Permissions } from "./Permissions";

export interface UserFormSchemaContext {
  $auth: AuthPlugin
  $i18n: I18n,
  $apiCalls: ApiCallsPlugin
  $store: any
  userIsNew: boolean
  userRole: number
  userIsPersonaGiuridica: boolean
  userBirthItaly: boolean
  userBusinessItaly: boolean
  userLegalReprItaly: boolean
  showReferenceAgent: boolean
  permissions: Permissions,
  formData: any
}
