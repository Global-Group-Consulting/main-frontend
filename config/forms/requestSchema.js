/**
 * @typedef ComputedContext
 * @property { typeof import("../../plugins/enums").enums } $enums
 * @property {} $i18n
 * @property { {} } formData
 * @property { {data : {type: number}, readonly: boolean} } dialogData
 */

import RequestTypes from "../../enums/RequestTypes"
import RequestStatus from "../../enums/RequestStatus"
import {computed} from "@vue/composition-api";

/**
 *
 * @param {ComputedContext} context
 * @returns {import("../../@types/FormSchema").FormSchema[]}
 */
export default function (context) {
  const isVersamento = context.dialogData && [context.$enums.RequestTypes.VERSAMENTO, context.$enums.RequestTypes.COMMISSION_MANUAL_ADD].includes(context.dialogData.data?.type)
  const isNew = !context.formData.id
  const readonly = context.dialogData.readonly
  const isCompleted = context.formData.status && ![RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(context.formData.status)
  const hasWithdrawalPermissions = computed(() => {
    const userIsGold = context.formData.gold;
    const userClubUnsubscribed = !context.formData.clubPack || context.formData.clubPack === context.$enums.ClubPacks.UNSUBSCRIBED;

    return !(userIsGold && userClubUnsubscribed);
  })

  console.log(hasWithdrawalPermissions.value)

  return [
    {
      cols: {
        type: {
          label: "requestType",
          if: (!readonly && !isVersamento) || readonly,
          component: !readonly ? 'v-select' : null,
          disabled: readonly || !hasWithdrawalPermissions.value,
          formatter: readonly ? (value) => context.$i18n.t(`enums.RequestTypes.${context.$enums.RequestTypes.getIdName(value)}`) : null,
          items: !readonly ? context.$enums.RequestTypes.list.reduce((acc, type) => {
            const reqGold = [context.$enums.RequestTypes.RISC_CAPITALE_GOLD, context.$enums.RequestTypes.RISC_INTERESSI_BRITE].includes(type.value)
            let mustHide = false

            if (type.value === context.$enums.RequestTypes.VERSAMENTO
              || type.value === context.$enums.RequestTypes.COMMISSION_MANUAL_ADD
              || type.value === context.$enums.RequestTypes.COMMISSION_MANUAL_TRANSFER
              || (type.value === context.$enums.RequestTypes.RISC_PROVVIGIONI && context.$auth.user.role !== context.$enums.UserRoles.AGENTE)
              || reqGold
            ) {
              mustHide = true
            }

            if (!mustHide) {
              type.text = context.$i18n.t(`enums.RequestTypes.${type.text}`)

              acc.push(type)
            }

            return acc
          }, []) : null
        },
      }
    },
    {
      cols: {
        wallet: {
          label: "walletType",
          component: null,
          items: context.$enums.WalletTypes,
          disabled: true,
          formatter: (value) => context.$i18n.t(`enums.WalletTypes.${context.$enums.WalletTypes.getIdName(value)}`),
          if: context.$enums.UserRoles.CLIENTE !== context.$auth.user.role
            && context.formData.type !== context.$enums.RequestTypes.VERSAMENTO
        },
      }
    },
    /* {
      cols: {
        currency: {
          label: "currencyType",
          if: (!readonly && !isVersamento) || readonly,
          component: !readonly ? 'v-select' : null,
          formatter: readonly ? (value) => context.$i18n.t(`enums.CurrencyType.${context.$enums.CurrencyType.getIdName(value)}`) : null,
          items: context.$enums.CurrencyType,
          disabled: context.formData.type === context.$enums.RequestTypes.VERSAMENTO || readonly,
        },
      }
    }, */
    {
      cols: {
        targetUser: {
          disabled: true,
          formatter: (item) => {
            return item.firstName + " " + item.lastName + ` (${item.email})`
          },
          if: context.formData.type === RequestTypes.COMMISSION_MANUAL_ADD,
        }
      }
    },
    {
      cols: {
        availableAmount: {
          disabled: true,
          component: 'money-input',
          currency: context.formData.currency,
          if: (!readonly && !isVersamento) || readonly,
        }
      }
    },
    {
      cols: {
        amount: {
          label: "requestAmount",
          component: context.formData.autoWithdrawlAll ? '' : 'money-input',
          disabled: readonly || context.formData.autoWithdrawlAll,
          currency: context.formData.currency,
          showMax: context.formData.wallet === 2,
          maxValue: context.formData.availableAmount,
          validations: context.formData.autoWithdrawlAll ? {} : {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: context.formData.type === RequestTypes.VERSAMENTO ? null : context.formData.availableAmount || 0.5
            }
          }
        },
      }
    },
    {
      cols: {
        created_at: {
          label: "requestCreatedAt",
          component: 'date-picker',
          if: !isNew,
          disabled: true,
          "prepend-icon": "",
          "prepend-inner-icon": "mdi-calendar",
        },
      }
    },
    {
      cols: {
        completed_at: {
          label: "requestCompletedAt",
          if: isCompleted,
          disabled: true,
          formatter: "dateHourFormatter",
          "prepend-icon": "",
          "prepend-inner-icon": "mdi-calendar",
        },
      }
    },
    {
      cols: {
        clubCardNumber: {
          disabled: true,
          if: context.formData.typeClub === "brite"
        },
      }
    },
    {
      cols: {
        iban: {
          disabled: true,
          if: context.formData.typeClub === "brite"
        },
      }
    },
    /* {
       cols: {
         requestAttachment: {
           component: 'file-uploader',
           "prepend-icon": "",
           "prepend-inner-icon": "$file",
           if: isVersamento,
           disabled: readonly,
           files: context.formData.files,
         },
       }
     },*/
    {
      cols: {
        notes: {
          label: "requestNotes",
          component: 'v-textarea',
          autoGrow: true,
          disabled: readonly,
          rows: 1
        }
      }
    },
    /* {
      cols: {
        notes: {
          label: "requestRejectReason",
          component: 'v-textarea',
          autoGrow: true,
          disabled: true,
          rows: 1,
          if: context.formData.status === context.$enums.RequestStatus.RIFIUTATA
        }
      }
    } */
    {
      maxCols: 2,
      cols: {
        autoWithdrawlAll: {
          component: 'v-checkbox',
          disabled: readonly,
        },
        autoWithdrawlAllRecursively: {
          component: 'v-checkbox',
          disabled: readonly || !context.formData.autoWithdrawlAll,
        }
      }
    },
  ]
}
