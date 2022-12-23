<template>
  <v-layout>
    <v-flex>
      <page-header page-name="movements"></page-header>

      <page-toolbar filters-schema="movements"
                    always-visible
                    filter-on-enter
      ></page-toolbar>

      <v-row>
        <v-col cols="12">
            <movements-list-table :user-id="userId" :flat="false"/>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
/** @typedef {import('../@types/Movement').IMovement} IMovement */

import { ref, onBeforeMount, computed } from '@vue/composition-api'

import DataTable from '../components/table/DataTable'
import MovementTypes from '../enums/MovementTypes'

import pageBasicFn from '../functions/pageBasic'
import PageHeader from '@/components/blocks/PageHeader'
import MovementsListTable from '../components/table/MovementsListTable'
import { MovementsPermissions } from '../functions/acl/enums/movements.permissions'

export default {
  components: {
    PageHeader,
    MovementsListTable,
    DataTable
  },
  meta: {
    permissions: [MovementsPermissions.ACL_MOVEMENTS_SELF_READ]
  },
  setup (props, { root }) {
    const userId = computed(() => root.$auth.user.id)

    return {
      ...pageBasicFn(root, 'movements'),
      userId
    }
  }
}
</script>

<style scoped></style>
