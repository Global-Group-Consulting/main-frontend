<template>
  <div>
    <v-icon color="#b4975a" v-if="item.typeClub">mdi-diamond-outline</v-icon>

    <span v-html="getTipoRichiesta(item.type)"></span>

    <span v-if="item.autoWithdrawlAll">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn text rounded v-on="on" color="primary">
              <v-icon v-if="item.autoWithdrawlAllRecursively">mdi-repeat</v-icon>
              <v-icon>mdi-infinity</v-icon>
            </v-btn>
          </template>

          {{ $t(`pages.requests.autoWithdrawlAll${item.autoWithdrawlAllRecursively ? 'Recursive' : ''}-tooltip`) }}
        </v-tooltip>
      </span>

    <v-tooltip v-if="$enums.RequestTypes.COMMISSION_MANUAL_ADD === item.type"
               bottom
               open-on-click>
      <template v-slot:activator="{ on }">
        <v-btn icon @click.stop="getTargetUser" v-on="on">
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>

      Vedi l'utente destinatario
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {RequestFormData} from "~/@types/Requests";

@Component({})
export default class CellRequestType extends Vue {
  @Prop({type: Object, required: true})
  public item!: RequestFormData

  getTipoRichiesta(_id: any) {
    let id = this.$enums.RequestTypes.get(_id).id
    const isInitialMovement = this.item.initialMovement

    if (isInitialMovement) {
      id = 'versamento_iniziale'
    }

    return this.$t('enums.RequestTypes.' + id) + (isInitialMovement ? ' (<strong>Nuovo Cliente</strong>)' : '')
  }

  async getTargetUser() {
    if (!this.item.targetUser) {
      try {
        this.item.targetUser = await this.$apiCalls.readRequestTargetUser(this.item.targetUserId)
      } catch (er) {
        return this.$alerts.error(er)
      }
    }

    this.$alerts.info({
      title: "",
      html: `Agente destinatario:<br>
            ${this.item.targetUser.firstName} ${this.item.targetUser.lastName} (${this.item.targetUser.email})
            `
    })
  }

}
</script>

<style scoped>

</style>
