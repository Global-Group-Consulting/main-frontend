import { FormSchema } from '~/@types/FormSchema'
import Vue from 'vue'
import MovementTypes from '~/enums/MovementTypes'
import UserRoles from '~/enums/UserRoles'

function getValidRoleOptions ($i18n: any): any {
  return [UserRoles.AGENTE, UserRoles.CLIENTE].map((role) => ({
      value: role,
      text: $i18n.t(`enums.UserRoles.${UserRoles.getIdName(role)}`)
    })
  )
}

export default function (this: Vue): FormSchema[] {
  
  return [
    {
      cols: {
        user: {
          label: 'filters-user',
          component: 'async-autocomplete',
          asyncFn: this.$apiCalls.selectOptions.getUsersList,
          clearable: true
        },
        role: {
          component: 'v-select',
          label: 'filters-role',
          clearable: true,
          items: getValidRoleOptions(this.$i18n)
        },
       /* minTime: {
          label: 'minTime'
        },
        maxTime: {
          label: 'maxTime'
        }*/
        
      }
    }
  ]
  
}
