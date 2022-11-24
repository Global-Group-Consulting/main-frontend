<template>
  <v-card elevation="2">
    <v-card-title>Deposito e Rendita</v-card-title>

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
            <template v-if="!formatAsInt">€ {{ moneyFormatter(item.value) }}</template>
            <template v-else>{{ item.value }}</template>
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
                   @click="action.action">
              {{ action.label }}
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>

    <commissions-add-dialog
        v-if=" $store.getters['dialog/dialogId'] === 'CommissionsAddDialog'"/>
  </v-card>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { moneyFormatter } from '~/plugins/filters'
import RequestTypes from '~/enums/RequestTypes'
import CommissionsAddDialog from '~/components/dialogs/CommissionsAddDialog.vue'
import { DashboardBlockAction, DashboardBlockData } from '~/@types/Dashboard'

export default defineComponent({
  name: 'DashboardUserDeposit',
  components: { CommissionsAddDialog },
  props: {
    user: {
      type: Object,
      required: true
    },
    userId: {
      type: String
    }
  },
  setup (props, { root }) {
    const formatAsInt = ref(false)
    const authUserIsRealAdmin = computed(() => {
      return root.$store.getters['user/userIsRealAdmin']
    })

    const userIsGold = computed(() => {
      return props.user.gold
    })

    const data = ref({
      deposit: 0,
      interestAmount: 0,
      depositCollected: 0,
      interestsCollected: 0,
      clubRepayment: 0
    })

    const blocksActions = {
      addDeposit () {
        if (authUserIsRealAdmin.value) {
          return blocksActions.openAdminRequestDialog(RequestTypes.VERSAMENTO)
        }

        root.$router.push('/requests#new_add_deposit')
      },
      addCommissions () {
        root.$store.dispatch('dialog/updateStatus', {
          id: 'CommissionsAddDialog',
          title: root.$t('dialogs.commissionsAddDialog.title'),
          texts: {
            cancelBtn: 'dialogs.commissionsAddDialog.btn-cancel',
            confirmBtn: 'dialogs.commissionsAddDialog.btn-send'
          },
          data: {
            user: props.user
          }
        })
      },
      showMovementsList () {
        root.$router.push('/movements')
      },
      collectDeposit () {
        if (authUserIsRealAdmin.value) {
          return blocksActions.openAdminRequestDialog(RequestTypes.RISC_CAPITALE)
        }

        root.$router.push('/requests#new_collect_deposit')
      },
      collectInterests () {
        if (authUserIsRealAdmin.value) {
          return blocksActions.openAdminRequestDialog(userIsGold.value ? RequestTypes.RISC_INTERESSI_BRITE : RequestTypes.RISC_INTERESSI)
        }

        root.$router.push('/requests#new_collect_interests')
      },
      collectCommissions () {
        root.$router.push('/requests#new_collect_commissions')
      },
      async addRepayment () {
        await root.$store.dispatch('dialog/updateStatus', {
          id: 'AgentRequestRepayment',
          title: 'Nuova richiesta di <strong>Rimborso</strong>',
          texts: {
            cancelBtn: 'dialogs.agentBriteAddDialog.btn-cancel',
            confirmBtn: 'dialogs.agentBriteAddDialog.btn-send'
          },
          data: {
            user: props.user,
            maxValue: await root.$apiCalls.fetchCommissionsAvailable(root.$auth.user.id)
          }
        })
      },
      openAdminRequestDialog (request: any) {
        const reqText = RequestTypes.getIdName(request)
        const reqTranslation = root.$t('enums.RequestTypes.' + reqText)

        root.$store.dispatch('dialog/updateStatus', {
          id: 'AdminRequestDialog',
          title: root.$t('dialogs.adminRequestDialog.title', { request: reqTranslation }),
          texts: {
            cancelBtn: 'dialogs.adminRequestDialog.btn-cancel',
            confirmBtn: 'dialogs.adminRequestDialog.btn-send'
          },
          data: {
            user: props.user,
            type: request
          }
        })
      }
    }

    const listItems: ComputedRef<DashboardBlockData[]> = computed(() => {
      return [
        {
          label: 'Deposito',
          icon: 'mdi-cloud-upload',
          color: 'blue',
          value: data.value.deposit,
          actions: [
            {
              label: 'Versa',
              action: blocksActions.addDeposit,
              if: root.$store.getters['user/userIsAdmin']
            },
            {
              label: 'Rimborso',
              action: blocksActions.addRepayment,
              if: root.$store.getters['user/userIsAgente']
            }
          ]
        }, {
          label: 'Rendite',
          icon: 'mdi-chart-timeline-variant',
          color: 'green',
          value: data.value.interestAmount,
          actions: [{
            label: 'Riscuoti Rendite',
            action: blocksActions.collectInterests,
            if: root.$store.getters['user/current']._id === props.userId || root.$store.getters['user/userIsAdmin']
          }]
        }, {
          label: 'Rendite Riscosse',
          icon: 'mdi-cloud-download',
          color: 'red',
          value: data.value.interestsCollected,
          actions: [
            {
              label: 'Lista Movimenti',
              action: blocksActions.showMovementsList,
              if: root.$store.getters['user/userIsCliente']
            }
          ]
        }, {
          label: 'Deposito Prelevato',
          icon: 'mdi-chart-sankey-variant',
          color: 'orange',
          value: data.value.depositCollected,
          actions: [{
            label: 'Preleva Deposito',
            action: blocksActions.collectDeposit,
            if: root.$store.getters['user/current']._id === props.userId || root.$store.getters['user/userIsAdmin']
          }]
        }, {
          label: 'Rimborsi Club',
          icon: 'mdi-chart-sankey-variant',
          color: 'yellow',
          value: data.value.clubRepayment,
          actions: []
        }
      ].map((el) => {
        el.actions = el.actions.filter((item: DashboardBlockAction) => item.if ?? true)

        return el
      })
    })

    async function fetchData () {
      if (props.userId) {
        const result = await root.$apiCalls.dashboardFetch(props.userId)

        data.value = result.blocks
      }
    }

    watch(() => props.userId, () => {
      fetchData()
    }, { immediate: true })

    onMounted(() => {
      root.$nuxt.$on('requests:newAdded', fetchData)
    })

    return {
      formatAsInt,
      listItems,
      moneyFormatter
    }
  }

})
</script>

<style scoped>

</style>
