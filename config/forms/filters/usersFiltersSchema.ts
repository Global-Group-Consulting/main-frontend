import { FormSchema } from '~/@types/FormSchema'
import UserRoles from '~/enums/UserRoles'
import AccountStatuses from '~/enums/AccountStatuses'
import ClubPacks from '~/enums/ClubPacks'
import { User } from '~/@types/UserFormData'
import { RequestFormData } from '~/@types/Requests'
import { RangeValue } from '~/@types/components/form/MoneyInputRange'
import rangeMoney from '~/functions/filters/rangeMoney'

/*
contractStatus: string[] | ((data: any, searchValue: any) => boolean)
 */
export const usersFiltersFieldsMap = {
  name: ['firstName', 'lastName'],
  email: ['email'],
  role: ['role'],
  contractStatus: (data: User, searchValue: any): boolean => {
    let result = false
    
    switch (searchValue) {
      case 'missing':
        result = !data.contractImported && !data.contractSignedAt
        
        break
      case 'imported':
        result = data.contractImported ?? false
        
        break
      case 'pending':
        result = !data.contractImported && !data.contractSignedAt && data.account_status === AccountStatuses.VALIDATED
        
        break
      case 'signed':
        result = !data.contractImported && !!data.contractSignedAt
        
        break
    }
    
    return result
  },
  accountStatus: ['account_status'],
  clubPack: ['clubPack'],
  contractId: ['contractNumber'],
  gold: ['gold'],
  suspended: ['suspended'],
  depositRange: (data: any, searchValue: RangeValue): boolean => rangeMoney(data.earnings.deposit, searchValue),
  interestRange: (data: any, searchValue: RangeValue): boolean => rangeMoney(data.earnings.interests, searchValue)
}

const booleanSelectOptions = [
  {
    value: true,
    text: 'Si'
  },
  {
    value: false,
    text: 'No'
  }
]

/**
 *
 * @param userIsAdmin
 * @param $i18n
 */
function getValidRoleOptions (userIsAdmin: boolean, $i18n: any): any {
  if (userIsAdmin) {
    return UserRoles
  }
  
  return [UserRoles.AGENTE, UserRoles.CLIENTE].map((role) => ({
      value: role,
      text: $i18n.t(`enums.UserRoles.${UserRoles.getIdName(role)}`)
    })
  )
}

export default function (this: Vue): FormSchema[] {
  const userAdmin = this.$store.getters['user/userIsAdmin']
  
  return [
    {
      cols: {
        name: {
          label: 'filters-name',
          clearable: true
        },
        email: {
          clearable: true
        },
        role: {
          component: 'v-select',
          label: 'filters-role',
          clearable: true,
          items: getValidRoleOptions(userAdmin, this.$i18n)
        },
        contractStatus: {
          component: 'v-select',
          label: 'filters-contract-status',
          clearable: true,
          items: [
            {
              value: 'missing',
              text: 'Assente'
            }, {
              value: 'imported',
              text: 'Importato'
            }, {
              value: 'pending',
              text: 'In attesa di firma'
            }, {
              value: 'signed',
              text: 'Firmato'
            }
          ]
        },
        accountStatus: {
          component: 'v-select',
          label: 'filters-account-status',
          clearable: true,
          items: AccountStatuses
        },
        clubPack: {
          component: 'v-select',
          label: 'filters-club-pack',
          clearable: true,
          items: ClubPacks
        },
        contractId: {
          label: 'filters-contract-id',
          clearable: true
        },
        /*depositRange: {
          component: 'money-input-range',
          maxLabel: 'filters.total-deposit-max',
          minLabel: 'filters.total-deposit-min',
          clearable: true
        },
        interestRange: {
          component: 'money-input-range',
          maxLabel: 'filters.total-interest-max',
          minLabel: 'filters.total-interest-min',
          clearable: true
        },*/
        gold: {
          component: 'v-select',
          label: 'filters-gold',
          clearable: true,
          items: booleanSelectOptions
        },
        suspended: {
          component: 'v-select',
          label: 'filters-account-suspended',
          clearable: true,
          items: booleanSelectOptions
        }
      }
    }
  ]
}
