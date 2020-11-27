import { UserDataSchema } from "./UserFormData";

export interface AuthPlugin {
  busy: boolean,
  loggedIn: boolean,
  strategy: string
  user: UserDataSchema
}
