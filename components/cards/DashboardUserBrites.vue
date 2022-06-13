<template>
  <v-card elevation="2">
    <v-card-title>Brite Club</v-card-title>

    <v-list-group v-for="(item, i) of listItems" :key="i"
                  v-model="item.active"
                  :append-icon="item.actions.length === 0 && item.childs.length === 0 ? '' : '$expand'"
                  :disabled="item.actions.length === 0 && item.childs.length === 0"
                  :ripple="item.actions.length > 0 || item.childs.length > 0"
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

      <v-list-item v-if="item.childs.length > 0" v-for="(child, i) in item.childs" :key="'item-child-' + i">
        <v-list-item-content>
          <v-list-item-title v-html="child.value"></v-list-item-title>
          <v-list-item-subtitle>{{ child.label }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-card>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from '@vue/composition-api'
import { DashboardBlockAction, DashboardBlockData } from '~/@types/Dashboard'
import { formatBrites, formatCurrency } from '~/plugins/filters/currency'
import { DashboardBritesData } from '~/@types/Brites'

export default defineComponent({
  name: 'DashboardUserBrites',
  props: {
    userId: {
      type: String
    }
  },
  setup (props, { root }) {
    const data: Ref<DashboardBritesData> = ref()

    const listItems: ComputedRef<DashboardBlockData[]> = computed(() => {
      const resoconto: any[] = []

      data.value?.expirations?.forEach(el => {
        if (el.usable > 0) {
          const expiration = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(el.date))

          resoconto.push({
            label: `Scadenza: ${expiration}`,
            value: formatBrites(el.usable)
          })
        }
      })

      const semesters: any[] = data.value?.semesters.reduce((acc, el) => {
        if (el.totalUsable > 0) {
          const semester = el.semesterId.split('_')
          const usableFrom = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(el.usableFrom))

          acc.push({
            label: `Semestre ${semester[1].padStart(2, '0')} del ${semester[0]}`,
            icon: 'mdi-wallet',
            color: 'orange',
            value: formatBrites(el.totalUsable),
            actions: [],
            childs: [
              {
                label: 'Brite utilizzabili dal ' + usableFrom,
                value: formatBrites(el.totalUsable)
              }, {
                label: 'Brite utilizzati',
                value: formatBrites(el.totalUsed)
              }, {
                label: 'Totale accumulato',
                value: formatBrites(el.totalEarned)
              }
            ]
          })
        }

        return acc
      }, [] as any[]) ?? []

      return [
        {
          label: 'Totale utilizzabile',
          icon: 'mdi-wallet',
          color: 'green',
          value: formatBrites(data.value?.totalUsable),
          actions: [],
          childs: [
            ...resoconto
          ]
        },
        ...semesters
      ].map((el) => {
        // el.actions = el.actions.filter((item: DashboardBlockAction) => item.if ?? true)

        return el
      })
    })

    watch(() => props.userId, async (userId) => {
      if (!userId) {
        return
      }
      data.value = await root.$apiCalls.club.fetchStatistics(userId)
    }, { immediate: true })

    return {
      listItems,
      data
    }
  }
})
</script>

<style scoped>

</style>
