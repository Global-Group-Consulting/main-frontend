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
               v-for="(group, key) in usersGroups" :key="key">
          <v-card dark
                  :color="$enums.UserRoles.get(key).color">
            <v-card-title>{{ $enums.UserRoles.get(key).text }}</v-card-title>
            <v-data-table
              light
              :headers="usersTable.headers"
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
import usersTable from '@/config/tables/usersSchema'
import fakeUsers from '@/assets/fakeUsers'
import UsersCrudActions from '@/components/table/UsersCrudActions'

import pageBasic from '@/functions/pageBasic'

export default {
  name: 'index',
  components: { UsersCrudActions, PageHeader },
  setup (props, { root }) {
    const pageData = pageBasic(root, 'users')

    function goToUser (userId) {
      root.$router.push('/users/' + userId)
    }

    return {
      ...pageData,
      onRowClick: goToUser
    }
  },
  data () {
    return {
      rawUsersGroups: {},
      floatingBtn: false
    }
  },
  computed: {
    usersTable,
    usersGroups () {
      const data = {
        admin: [],
        servClienti: [],
        agente: [],
        cliente: []
      }

      // if the user is agent, can see only his clients
      if (this.$auth.user.role === this.$enums.UserRoles.AGENTE) {
        return {
          cliente: this.rawUsersGroups.reduce((acc, el) => {
            acc.push(...el.data)

            return acc
          }, [])
        }
      }

      for (let group of this.rawUsersGroups) {
        const groupId = this.$enums.UserRoles.get(group._id.role).id

        data[groupId] = group.data
      }

      return data
    },
  },
  methods: {},
  created () {
    // const {data} = await context.$axios.get('/api/users/getAll')

    // this.rawUsersGroups = data
    this.rawUsersGroups = fakeUsers
  }
}
</script>

<style scoped>

</style>
