<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        icon
        v-on="on"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="onModificaClick">
        <v-list-item-title>Modifica</v-list-item-title>
      </v-list-item>
      <v-list-item @click="onEliminaClick">
        <v-list-item-title>Elimina</v-list-item-title>
      </v-list-item>
      <v-list-item @click="onComunicazioneClick">
        <v-list-item-title>Invia Comunicazione</v-list-item-title>
      </v-list-item>
      <v-list-item @click="">
        <v-list-item-title>Mostra Richieste</v-list-item-title>
      </v-list-item>
      <v-list-item @click="entraCome">
        <v-list-item-title>Entra come...</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import fakeUsers from '@/assets/fakeUsers'

export default {
  name: 'UsersCrudActions',
  data () {
    return {
      item: {}
    }
  },
  methods: {
    onModificaClick () {
      this.$router.push('/users/' + row._id)
    },
    async onEliminaClick () {
      /*this.$notifier.ask({
        title: 'Eliminare l\'utente?',
        html: `Sei sicuro di voler eliminare l'utente <strong>${this.item.nome} ${this.item.cognome}</strong>?`,
        preConfirm: async () => {
          try {
            await this._eliminaUtente()

            this.$emit('remove', this.item)

            return this.$notifier.success()
          } catch (e) {
            this.$notifier.error(e)
            return
          }
        }
      })*/
    },
    onComunicazioneClick () {

    },
    async _eliminaUtente () {
      /*try {
        const postCall = await this.$axios.delete(`/api/users/delete`, { data: { userId: this.item.userId } })

        return postCall
      } catch (e) {
        return Promise.reject(e)
      }*/
    },
    async entraCome (user) {
      /*try {
        const resp = await this.$axios.post('/api/loginAs', { userId: this.item.userId })

        window.open('/?setActiveUser=secondary')
      } catch (e) {
        this.$notifier.error(e)
      }*/
    }
  }
}
</script>

<style scoped>

</style>
