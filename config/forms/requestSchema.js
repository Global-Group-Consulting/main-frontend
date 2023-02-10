/**
 * @typedef ComputedContext
 * @property { typeof import("../../plugins/enums").enums } $enums
 * @property {} $i18n
 * @property { {} } formData
 * @property { {data : {type: number}, readonly: boolean} } dialogData
 */

import RequestTypes from "../../enums/RequestTypes";
import RequestStatus from "../../enums/RequestStatus";
import {computed} from "@vue/composition-api";
import UserRoles from "~/enums/UserRoles";
import {moneyFormatter, userFormatter} from "~/plugins/filters";
import {CardsList} from '~/config/cardsList';

function getRequestTypeList(list, context) {
  const userType = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+context.$auth.user.role) ? "admin" : "user";
  
  // const canDeposit = context.canDeposit;
  const canRequestGold = userType === "user" && context.$auth.user.gold;
  const canRequestClassic = userType === "user" && !context.$auth.user.gold;
  const isAgent = context.$auth.user.role === UserRoles.AGENTE;
  
  const data = list.filter((el) => {
    let mustReturn = false;

    if (canRequestClassic && [RequestTypes.RISC_INTERESSI].includes(el.value)) {
      mustReturn = true;
    } else if (canRequestGold) {
      // return [RequestTypes.RISC_INTERESSI_BRITE, RequestTypes.RISC_INTERESSI_GOLD].includes(el.value)
    }

    if (isAgent && [RequestTypes.RISC_PROVVIGIONI].includes(el.value) && context.incomingData.type === RequestTypes.RISC_PROVVIGIONI) {
      mustReturn = true;
    }
    
    return mustReturn
  })

  const toReturn = data.map(el => {
    el.text = context.$i18n.t(`enums.RequestTypes.${el.text}`)

    return el
  })
  
  return toReturn
}

function getAmountMessage(context) {
  /**
   * @type {GlobalSettings}
   */
  const settings = context.$store.getters["settings/globalSettings"]

  const amount = context.formData.amount;
  const amountOfBrite = amount * settings.requestBritePercentage / 100;
  const percent = settings.requestBritePercentage;
  const limit = settings.requestMinAmount;

  if (percent === undefined || limit === undefined || context.formData.type !== RequestTypes.RISC_PROVVIGIONI) {
    if (context.formData.cards && context.formData.cards.length > 0) {
      const cardsList = [];

      for (const card of context.formData.cards) {
        const storedCard = CardsList.find(storedCard => storedCard.id === card.id);

        if (storedCard) {
          cardsList.push(storedCard.title + ": <strong>€ " + moneyFormatter(card.amount) + "</strong>");
        }
      }

      return cardsList.join("; ");
    }

    return "";
  }

  let finalAmount = amount;
  let finalAmountBrite = amountOfBrite;

  if (amount > limit) {
    finalAmount = amount - amountOfBrite;
  } else {
    finalAmountBrite = amount
  }

  return context.$i18n.t("forms.requests-amount-message-" + (amount > limit ? "brite-percent" : "all-brites"), {
    amount: moneyFormatter(finalAmount),
    amountBrite: moneyFormatter(finalAmountBrite * 2, true),
    percent,
    limit
  })
}

/**
 *
 * @param {ComputedContext} context
 * @returns {import("../../@types/FormSchema").FormSchema[]}
 */
export default function (context) {
  const isVersamento = context.dialogData
    && [context.$enums.RequestTypes.VERSAMENTO, context.$enums.RequestTypes.COMMISSION_MANUAL_ADD, context.$enums.RequestTypes.RISC_CAPITALE]
      .includes(context.dialogData.data?.type)
  const isNew = !context.formData.id
  const readonly = context.dialogData.readonly
  const isCompleted = context.formData.status && ![RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(context.formData.status)
  const hasWithdrawalPermissions = computed(() => {
    const userIsGold = context.formData.gold;
    const userClubUnsubscribed = !context.formData.clubPack || context.formData.clubPack === context.$enums.ClubPacks.UNSUBSCRIBED;

    return !(userIsGold && userClubUnsubscribed);
  })


  return [
    {
      cols: {
        type: {
          label: "requestType",
          if: (!readonly && !isVersamento) || readonly,
          component: !readonly ? 'v-select' : null,
          disabled: readonly || !hasWithdrawalPermissions.value || context.incomingData.type === RequestTypes.RISC_PROVVIGIONI,
          formatter: readonly ? (value) => context.$i18n.t(`enums.RequestTypes.${context.$enums.RequestTypes.getIdName(value)}`) : null,
          items: !readonly ? getRequestTypeList(context.$enums.RequestTypes.list, context) : null
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
            && ![context.$enums.RequestTypes.VERSAMENTO, context.$enums.RequestTypes.RISC_CAPITALE].includes(context.formData.type)
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
          if: [RequestTypes.COMMISSION_MANUAL_ADD, RequestTypes.DEPOSIT_REPAYMENT].includes(context.formData.type),
        }
      }
    },
    {
      cols: {
        availableAmount: {
          disabled: true,
          component: 'money-input',
          currency: context.formData.currency,
          if: (!readonly && (!isVersamento || context.formData.type === RequestTypes.RISC_CAPITALE)) || readonly,
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
          showBrite: false,
          showMax: context.formData.wallet === 2,
          message: getAmountMessage(context),
          maxValue: context.formData.availableAmount,
          validations: context.formData.autoWithdrawlAll ? {} : {
            required: {},
            minValue: {
              params: 1
            },
            maxValue: {
              params: context.formData.type === RequestTypes.VERSAMENTO ? null : context.formData.availableAmount || 0.5
            },
            multipleOf: {
              params: [RequestTypes.VERSAMENTO, RequestTypes.RISC_PROVVIGIONI].includes(context.formData.type) ? null : {
                step: 50,
                until: context.$store.getters["settings/globalSettings"].cardsRequestMinAmount
              }
            }
          }
        },
      }
    },
    {
      cols: {
        goldAmount: {
          type: "number",
          if: context.$enums.RequestTypes.VERSAMENTO === context.formData.type,
          disabled: readonly,
          prefix: "gr.",
        }
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
    {
      cols: {
        requestAttachment: {
          component: 'file-uploader',
          "prepend-icon": "",
          "prepend-inner-icon": "$file",
          if: (readonly && context.formData.files && context.formData.files.length > 0) || (!readonly && context.formData.type === context.$enums.RequestTypes.VERSAMENTO),
          disabled: readonly,
          previewOnly: readonly,
          files: context.formData.files,
          validations: context.formData.autoWithdrawlAll ? {} : {
            required: {},
          }
        },
      }
    },
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
          if: context.formData.type === RequestTypes.RISC_PROVVIGIONI
        },
        /*autoWithdrawlAllRecursively: {
          component: 'v-checkbox',
          disabled: readonly || !context.formData.autoWithdrawlAll,
          if: context.formData.type === RequestTypes.RISC_PROVVIGIONI
        }*/
      }
    },
  ]
}
