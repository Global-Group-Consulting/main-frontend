<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn text
             @click="showClientsList(item)"
             :disabled="!+value"
             v-on="on"
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
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserClientsCount extends Vue {
  @Prop({type: Object, required: true})
  public item!: User

  get value() {
    return this.item.clientsCount;
  }

  async showClientsList(user: User) {
    try {
      // Fetch the users list
      const usersList = await this.$apiCalls.getClientsList(user.id)

      await this.$store.dispatch("dialog/updateStatus", {
        title: this.$i18n.t("dialogs.clientsList.title"),
        id: "ClientsListDialog",
        fullscreen: false,
        large: true,
        readonly: true,
        texts: {
          cancelBtn: "dialogs.clientsList.btn-cancel"
        },
        data: {
          usersList,
          agent: user
        }
      });
    } catch (e) {
      this.$alerts.error(e)
    }
  }
}
</script>

<style scoped>

</style>
