import {FormSchema} from "~/@types/FormSchema";
import UserRoles from "~/enums/UserRoles";
import AccountStatuses from "~/enums/AccountStatuses";
import ClubPacks from "~/enums/ClubPacks";
import {User} from "~/@types/UserFormData";

/*
contractStatus: string[] | ((data: any, searchValue: any) => boolean)
 */
export const clubFiltersFieldsMap = {
  name: ["firstName", "lastName"],
  email: ["email"],
  role: ["role"],
  accountStatus: ["account_status"],
  clubPack: ["clubPack"],
  clubCardNumber: ["clubCardNumber"],
  gold: ["gold"],
  suspended: ["suspended"],
}

export default function (): FormSchema[] {
  return [
    {
      cols: {
        name: {
          label: "filters-name"
        },
        email: {},
        clubPack: {
          component: "v-select",
          label: "filters-club-pack",
          clearable: true,
          items: ClubPacks,
        },
        clubCardNumber: {
          label: "filters-club-card-number",

        }
      },
    }
  ]
}
