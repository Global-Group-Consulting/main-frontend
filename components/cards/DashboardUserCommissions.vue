DashboardUserDeposit.vue
<template>
  <v-card elevation="2">
    <v-card-title>Provvigioni</v-card-title>

    <v-list-group v-for="(item, i) of listItems" :key="i"
                  v-model="item.active"
                  :append-icon="item.actions.length === 0 ? '' : '$expand'"
                  :disabled="item.actions.length === 0"
                  :ripple="item.actions.length > 0"
                  no-action>
      <template v-slot:prependIcon>
        <v-icon :color="item.color">
          {{ item.icon }}
        </v-icon>

      </template>

      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            <span v-html="item.value"></span>
            <small style="font-weight: normal; font-style: italic" v-if="item.valueExtra"
                   v-html="item.valueExtra"></small>
          </v-list-item-title>

          <v-list-item-subtitle>{{ item.label }}</v-list-item-subtitle>
        </v-list-item-content>
      </template>

      <v-list-item v-if="item.actions.length > 0">
        <v-list-item-content>
          <div class="d-flex" style="gap: 1rem">
            <v-btn outlined small color="primary" class="flex-grow-1"
                   v-for="(action, y) of item.actions"
                   :key="'item-action-' + y"
                   :disabled="action.disabled"
                   @click="action.action">
              {{ action.label }}
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>

    <commissions-add-dialog v-if="$store.getters['dialog/dialogId'] === 'CommissionsAddDialog'"
                            @commissionsAdded="onCommissionsAdded"/>
    <agent-brite-use-dialog v-if="$store.getters['dialog/dialogId'] === 'AgentBriteUseDialog'"/>
    <agent-brite-add-dialog v-if="$store.getters['dialog/dialogId'] === 'AgentBriteAddDialog'"
                            @commissionsAdded="onCommissionsAdded"/>
  </v-card>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, watch } from '@vue/composition-api'
import { DashboardBlockAction, DashboardBlockData } from '~/@types/Dashboard'
import { formatBrites, formatCurrency } from '~/plugins/filters/currency'
import CommissionsAddDialog from '~/components/dialogs/CommissionsAddDialog.vue'
import AgentBriteUseDialog from '~/components/dialogs/AgentBriteUseDialog.vue'
import AgentBriteAddDialog from '~/components/dialogs/AgentBriteAddDialog.vue'

export default defineComponent({
  name: 'DashboardUserCommissions',
  components: { AgentBriteAddDialog, AgentBriteUseDialog, CommissionsAddDialog },
  props: {
    user: {
      type: Object,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  setup (props, { root, emit }) {
    const formatAsInt = ref(false)
    const userIsRefAgent = computed(() => {
      return root.$auth.user.hasSubAgents
          && !root.$auth.user.referenceAgent
          && !!props.userId // if no userId is given i'm in the wallet page
    })
    const userIsAdmin = computed(() => {
      return root.$store.getters['user/userIsAdmin']
    })

    const data = ref({
      monthCommissions: 0,
      reinvestedCommissions: 0,
      collectedCommissions: {
        total: 0,
        totalBrite: 0,
        totalEuro: 0
      },
      clientsTotalDeposit: 0,
      agentBritesTotal: 0,
      agentBritesCurrMonth: 0
    })

    const blocksActions = {
      addCommissions () {
        root.$store.dispatch('dialog/updateStatus', {
          id: 'CommissionsAddDialog',
          title: root.$t('dialogs.commissionsAddDialog.title'),
          texts: {
            cancelBtn: 'dialogs.commissionsAddDialog.btn-cancel',
            confirmBtn: 'dialogs.commissionsAddDialog.btn-send'
          },
          data: {
            user: props.user || root.$auth.user
          }
        })
      },

      collectCommissions () {
        root.$router.push('/requests#new_collect_commissions')
      },

      addBrites () {
        if (!props.user) {
          return
        }

        root.$store.dispatch('dialog/updateStatus', {
          id: 'AgentBriteAddDialog',
          title: root.$t('dialogs.agentBriteAddDialog.title-add'),
          texts: {
            cancelBtn: 'dialogs.agentBriteAddDialog.btn-cancel',
            confirmBtn: 'dialogs.agentBriteAddDialog.btn-send'
          },
          data: {
            user: props.user,
            maxValue: data.value.agentBritesTotal
          }
        })
      },

      useBrites () {
        const user = root.$auth.user

        root.$store.dispatch('dialog/updateStatus', {
          id: 'AgentBriteUseDialog',
          title: root.$t('dialogs.agentBriteUseDialog.title'),
          texts: {
            cancelBtn: 'dialogs.agentBriteUseDialog.btn-cancel'
            //confirmBtn: "dialogs.commissionsAddDialog.btn-send"
          },
          data: {
            userName: user.firstName + ' ' + user.lastName,
            maxValue: data.value.agentBritesTotal
          }
        })
      }
    }

    const listItems: ComputedRef<DashboardBlockData[]> = computed(() => {
      return [
        {
          label: root.$t('pages.wallet.monthCommissions') as string,
          icon: 'mdi-wallet',
          color: 'green',
          value: formatCurrency(data.value.monthCommissions, true),
          actions: [
            {
              label: root.$t('pages.wallet.collectCommissions') as string,
              action: blocksActions.collectCommissions,
              if: !(userIsRefAgent.value || userIsAdmin.value)
            },
            {
              label: root.$t('pages.wallet.addCommissions') as string,
              action: blocksActions.addCommissions,
              if: userIsRefAgent.value || userIsAdmin.value
            }
          ]
        }, {
          label: root.$t('pages.wallet.reinvestedCommissions') as string,
          icon: 'mdi-wallet',
          color: 'orange',
          value: formatCurrency(data.value.reinvestedCommissions, true),
          actions: []
        }, {
          label: root.$t('pages.wallet.collectedCommissions') as string,
          icon: 'mdi-wallet',
          color: 'red',
          value: formatCurrency(data.value.collectedCommissions.total, true),
          valueExtra: `(€ ${formatCurrency(data.value.collectedCommissions.totalEuro, true)} e ${formatBrites(data.value.collectedCommissions.totalBrite)})`,
          actions: []
        }, {
          label: root.$t('pages.wallet.agentBritesTotal') as string,
          icon: '$brite',
          color: 'gold',
          value: formatBrites(data.value.agentBritesTotal),
          actions: [{
            label: root.$t('pages.wallet.addBrites') as string,
            action: blocksActions.addBrites,
            if: userIsAdmin.value
          }, {
            label: root.$t('pages.wallet.useBrites') as string,
            action: blocksActions.useBrites,
            disabled: !data.value.agentBritesTotal,
            if: !userIsAdmin.value && !userIsRefAgent.value
          }]
        }, {
          label: root.$t('pages.wallet.clientsTotalDeposit') as string,
          icon: 'mdi-wallet',
          color: 'green',
          value: formatCurrency(data.value.clientsTotalDeposit, true),
          actions: []
        }
      ].map((el) => {
        el.actions = el.actions.filter((item: DashboardBlockAction) => item.if ?? true)

        return el
      })
    })

    async function fetchData (userId: string) {
      if (userId) {
        const result = await Promise.all([
          root.$apiCalls.fetchCommissionsStatus(userId),
          root.$apiCalls.agentBriteApi.statistics(userId)
        ])

        data.value = result[0].blocks
        data.value.agentBritesTotal = result[1]['agentBritesTotal']
        data.value.agentBritesCurrMonth = result[1]['agentBritesCurrMonth']
      }
    }

    async function onCommissionsAdded () {
      await fetchData(props.userId)

      emit('reloadCommissions')
    }

    watch(() => props.userId, async (userId) => {
      await fetchData(userId)
    }, { immediate: true })

    return {
      formatAsInt,
      listItems,
      onCommissionsAdded
    }
  }
})
</script>

<style scoped>

</style>
