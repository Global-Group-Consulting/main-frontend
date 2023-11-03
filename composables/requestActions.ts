import { computed, ComputedRef, SetupContext } from '@vue/composition-api'
import { ActionItem } from '~/@types/ActionItem'
import RequestTypes from '~/enums/RequestTypes'
import ClubPacks from '~/enums/ClubPacks'

export function useRequestActions (ctx: SetupContext) {
  const { $store, $alerts, $router, $i18n, $auth } = ctx.root
  
  /**
   * // Utente NON GOLD
   *  - riscuote interessi / rendite in maniera classica
   *  - preleva deposito tramite richiesta chat (come per il versamento)
   *  - può versare come succede ora
   *
   * // Utente GOLD
   *  - riscuotere le rendite / interessi attraverso il dialog gold / club (o tramite brite o oro fisico)
   *  - usare lo stesso dialog del versamento ed il flusso deve essere lo stesso che per i versamenti. La richiesta quindi deve essere presa in carico e tramite chat si deve sviluppare.
   *  - preleva deposito tramite richiesta chat (come per il versamento)
   *  - può versare come succede ora
   *
   * // Agente Gold o NON Gold
   *  - riscuotere le provvigioni come ora.
   */
  const actionsList: ComputedRef<ActionItem[]> = computed(() => {
    return [
      {
        text: 'request-withdrawl-deposit',
        tooltip: 'request-withdrawl-deposit-tooltip',
        icon: 'mdi-bank-minus',
        click: () => newWithdrawalRequest(RequestTypes.RISC_CAPITALE),
        if: $store.getters['user/canWithdrawal'],
        options: {
          color: 'red'
        }
      },
      {
        text: 'request-withdrawl-classic',
        tooltip: 'request-withdrawl-classic-tooltip',
        icon: 'mdi-cash-minus',
        click: () => newWithdrawalRequest(RequestTypes.RISC_INTERESSI),
        if: $store.getters['user/canAddRequestClassic'],
        options: {
          color: 'orange'
        }
      },
      {
        text: 'request-withdrawl-club',
        tooltip: 'request-withdrawl-club-tooltip',
        icon: 'mdi-cash-minus',
        click: () => newWithdrawalRequestGold(RequestTypes.RISC_INTERESSI_BRITE),
        if: $store.getters['user/canAddRequestGold'],
        options: {
          color: 'orange'
        }
      },
      {
        text: 'request-deposit-new',
        tooltip: 'request-deposit-new-tooltip',
        icon: 'mdi-cash-plus',
        click: newDepositRequest,
        if: $store.getters['user/canDeposit'],
        options: {
          color: 'green'
        }
      },
      {
        text: 'request-download-report',
        if: $store.getters['user/canDownloadReport'],
        options: {
          color: 'primary'
        },
        click: () => $router.push('/reports')
      }
    ]
  })
  
  function newDepositRequest () {
    $store.dispatch('dialog/updateStatus', {
      title: $i18n.t('dialogs.requests.title-deposit'),
      id: 'RequestDialog',
      data: {
        type: RequestTypes.VERSAMENTO
      }
    })
  }
  
  function newWithdrawalRequest (type?: number) {
    const reqType = type || RequestTypes.RISC_INTERESSI
    
    /*

    Se essite una richiesta automatica però il messaggio non deve comparire
    perchè l'utente potrebbe voler richiedere altri tipi di riscossione o prelievi
    se NON è GOLD.
    In questo caso quindi la voce "richiesta provvigioni"  dovrebbe essere disabilitata

    Se è gold invece non può chiedere altri tipi se non quello dei gold

     */
    
    if (reqType === RequestTypes.RISC_CAPITALE && $store.getters['user/isItalian']) {
      if (!$auth.user.contractIban || !$auth.user.contractIban.trim().toLowerCase().startsWith('it')) {
        $alerts.info({
          title: 'Iban anagrafica non valido',
          html: `Per poter procedere con questa richiesta è necessario inserire un IBAN (SEPA) ${$store.getters['user/isItalian'] ? '<strong>Italiano</strong>' : ''} nella propria anagrafica.<br>
               Per impostarlo, premere sul <a href="/users/${$auth.user.id}">seguente link</a> e poi,
               dalla sezione <strong>Contratto</strong> compilare la voce <strong>IBAN Cliente</strong>.`
        })
        
        return
      }
    }
    
    if ($auth.user.autoWithdrawlAll && reqType === RequestTypes.RISC_PROVVIGIONI) {
      $alerts.info({
        title: '',
        html: $i18n.t('alerts.autoWithdrawl-not-available', { link: '/requests#' + $auth.user.autoWithdrawlAll }) as string,
        onOpen: (el: HTMLElement) => {
          el.querySelector('a')?.addEventListener('click', () => {
            $alerts.close()
          })
        }
      })
      
      return
    }
    
    $store.dispatch('dialog/updateStatus', {
      title: $i18n.t('dialogs.requests.title-withdrawal-' + reqType),
      id: 'RequestDialog',
      data: {
        type: reqType,
        gold: $auth.user.gold,
        clubPack: $auth.user.clubPack
      }
    })
  }
  
  function newWithdrawalRequestGold (type?: number) {
    if (!checkWithdrawalPermissions()) {
      return
    }
    
    // se non c'è un iban
    // oppure se l'utente è italiano e l'iban non è italiano
    if (!$auth.user.contractIban || ($store.getters['user/isItalian'] && !$auth.user.contractIban.trim().toLowerCase().startsWith('it'))) {
      $alerts.info({
        title: 'Iban anagrafica non valido',
        html: `Per poter procedere con questa richiesta è necessario inserire un IBAN (SEPA) ${$store.getters['user/isItalian'] ? '<strong>Italiano</strong>' : ''} nella propria anagrafica.<br>
               Per impostarlo, premere sul <a href="/users/${$auth.user.id}">seguente link</a> e poi,
               dalla sezione <strong>Contratto</strong> compilare la voce <strong>IBAN Cliente</strong>.`
      })
      
      return
    }
    
    $store.dispatch('dialog/updateStatus', {
      title: $i18n.t('dialogs.requests.title-withdrawal-gold'),
      id: 'RequestDialogGold',
      // fullscreen: true,
      // theme: 'global-club',
      // noActions: true,
      data: {
        type: type || RequestTypes.RISC_CAPITALE
      }
    })
  }
  
  /**
   * If the user is gold but doesn't have an active pack or the pack is "UNSUBSCRIBED",
   * won't let it make any withdrawal request except for hte commissions if an agent.
   */
  function checkWithdrawalPermissions () {
    const userIsGold = $auth.user.gold
    const userClubUnsubscribed = !$auth.user.clubPack || $auth.user.clubPack === ClubPacks.UNSUBSCRIBED
    
    if (userIsGold && userClubUnsubscribed) {
      $alerts.info({
        title: '',
        html: $i18n.t('alerts.club-request-unsubscribed') as string
      })
      
      return false
    }
    
    return true
  }
  
  return {
    actionsList,
    newDepositRequest,
    newWithdrawalRequest,
    newWithdrawalRequestGold
  }
}
