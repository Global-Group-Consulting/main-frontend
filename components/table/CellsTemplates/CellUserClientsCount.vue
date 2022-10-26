<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn text
             @click="showClientsList(item)"
             :disabled="!+value"
             v-on="on"
             :loading="loading"
             small
             color="primary">
        <v-icon small class="mr-2" v-if="+value === 1">mdi-account</v-icon>
        <v-icon small class="mr-2" v-else>mdi-account-multiple</v-icon>
        {{ +value || 0 }}
      </v-btn>
    </template>
    Mostra lista clienti
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { User } from '~/@types/UserFormData'

@Component({})
export default class CellUserClientsCount extends Vue {
  @Prop({ type: Object, required: true })
  public item!: User

  public loading = false

  get value () {
    return this.item.clients
  }

  async showClientsList (user: User) {
    this.loading = true

    try {
      // Fetch the users list
      // const usersList = await this.$apiCalls.getClientsList(user.id || user._id)

      // data will be loaded internally by the dialog
      await this.$store.dispatch('dialog/updateStatus', {
        title: this.$i18n.t('dialogs.clientsList.title'),
        id: 'ClientsListDialog',
        fullscreen: false,
        large: true,
        readonly: true,
        texts: {
          cancelBtn: 'dialogs.clientsList.btn-cancel'
        },
        data: {
          agent: user
        }
      })
    } catch (e) {
      this.$alerts.error(e)
    }

    this.loading = false
  }
}
</script>

<style scoped>

</style>
