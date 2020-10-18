<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-row>
        <v-col cols="12"
               v-for="{_id: key, data:group} in usersGroups" :key="key">
          <v-card dark
                  :color="getUerRoleData(key).color">
            <v-card-title>{{ getUerRoleData(key).text }}</v-card-title>
            <v-data-table
              light
              :headers="getTableHeaders(key)"
              :items="group"
              :items-per-page="10"
              @click:row="onRowClick($event._id)"
            >
              <template v-slot:item.contractNumber="{ item }">
                {{ $options.filters.contractNumberFormatter(item.contractNumber) }}
              </template>

              <template v-slot:item.businessRegion="{ item }">
                {{ item.businessRegion | regionFormatter($store.getters['enums/regionsList']) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <users-crud-actions :item="item"/>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <!-- Floating action button -->
        <v-fab-transition>
          <v-speed-dial
            v-model="floatingBtn"
            fab
            fixed
            bottom
            right
          >
            <v-btn
              slot="activator"
              v-model="floatingBtn"
              color="accent"
              fab
            >
              <v-icon v-if="!floatingBtn">mdi-dots-vertical</v-icon>
              <v-icon v-else>mdi-close</v-icon>
            </v-btn>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  dark
                  small
                  color="accent"
                  v-on="on"
                  to="/users/new"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('pages.users.btn-add-user') }}</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  dark
                  small
                  color="indigo"
                  v-on="on"
                >
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('pages.users.btn-filter-data') }}</span>
            </v-tooltip>

          </v-speed-dial>
        </v-fab-transition>
      </v-row>

    </v-flex>
  </v-layout>
</template>

<script>
import PageHeader from '@/components/blocks/PageHeader'
import UsersCrudActions from '@/components/table/UsersCrudActions'
import usersPage from '@/functions/usersPage'
import pageBasic from '@/functions/pageBasic'
import { onMounted } from '@vue/composition-api'

export default {
  name: 'index',
  components: { UsersCrudActions, PageHeader },
  setup (props, { root }) {
    const usersPageData = usersPage(root)

    onMounted(async () => {
      usersPageData.usersGroups.value = await usersPageData.fetchAllUsers()
    })

    return {
      ...usersPageData,
      ...pageBasic(root, 'users')
    }
  },
  data () {
    return {
      rawUsersGroups: {},
      floatingBtn: false
    }
  },
}
</script>

<style scoped>

</style>
