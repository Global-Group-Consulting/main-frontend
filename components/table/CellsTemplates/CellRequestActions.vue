<template>
  <div class="text-no-wrap text-right">

    <v-tooltip bottom v-if="missingAttachment">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.stop="addAttachment">
          <v-icon color="error">mdi-file-alert</v-icon>
        </v-btn>
      </template>

      <span v-if="item.type === $enums.RequestTypes.VERSAMENTO">Contabile assente</span>
      <span v-else-if="item.type === $enums.RequestTypes.RISC_CAPITALE">Modulo assente</span>
    </v-tooltip>

    <v-tooltip bottom v-for="(menu, i) of alwaysVisibleOptions" :key="i">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.stop="menu.action">
          <v-icon style="position: absolute">{{ menu.icon }}</v-icon>
        </v-btn>
      </template>

      <span>{{ menu.value }}</span>
    </v-tooltip>

    <v-tooltip bottom v-if="item.status === $enums.RequestStatus.ANNULLATA">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon style="position: absolute">mdi-information</v-icon>
        </v-btn>
      </template>

      <span>{{ $t("tables.request-cancelled") }}</span>
    </v-tooltip>

    <v-menu offset-y v-else-if="alwaysGroupedOptions.length > 0">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="entry in alwaysGroupedOptions">
          <v-divider v-if="entry.divider" :key="'divider_' + entry.value"></v-divider>

          <v-list-item :key="entry.value"
                       :entry="entry"
                       @click.prevent="entry.action">
            <v-list-item-title>{{
                $t("menus." + entry.value)
              }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>

    <!-- create an empty btn as a placeholder and for maintaining the space for the left btn-->
    <v-btn disabled v-else icon style="opacity: .3">
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {CrudMenuItem} from "~/@types/Tables/CrudMenuItem";
import {RequestFormData} from "~/@types/Requests";
import {RequestsTableActions} from "~/functions/requestsTableActions";
import RequestTypes from "~/enums/RequestTypes";
import RequestStatus from "~/enums/RequestStatus";

/**
 * @this Vue
 */
@Component({})
export default class CellRequestActions extends Vue {
  @Prop({type: Object})
  item!: RequestFormData

  //public actions = requestsCrudActionsFn(this.item, this);
  public actions!: RequestsTableActions;

  get belongsToAuthUser() {
    return this.item.userId === this.$auth.user.id
  }

  get isNew() {
    return this.item.status === RequestStatus.NUOVA
  }

  get isInCharge() {
    return this.item.status === RequestStatus.LAVORAZIONE
  }

  get userIsAdmin() {
    return this.$store.getters["user/userIsAdmin"];
  }

  get userIsSuperAdmin() {
    return this.$store.getters["user/userIsSuperAdmin"];
  }

  get firstMustTakeCharge() {
    return this.userIsAdmin
      && this.isNew
      && [RequestTypes.VERSAMENTO, RequestTypes.RISC_CAPITALE].includes(this.item.type)
      && [RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(this.item.status)
  }

  get menuOptions(): CrudMenuItem[] {

    return [
      {
        value: this.$t("menus.openRequest") as string,
        action: async () => this.actions.openDetailsDialog(this.item),
        alwaysVisible: true,
        icon: "mdi-open-in-app"
      },
      {
        value: "delete",
        action: async () => this.actions.delete(this.item),
        if: this.belongsToAuthUser && this.isNew
      },
      {
        value: "cancelRequest",
        action: async () => this.actions.cancel(this.item),
        if: this.belongsToAuthUser &&
          this.item.status === this.$enums.RequestStatus.ACCETTATA && this.item.canCancel
      },
      {
        value: "adminCancelRequest",
        action: async () => this.actions.adminCancel(this.item),
        if: this.userIsAdmin &&
          this.item.status === this.$enums.RequestStatus.ACCETTATA && this.item.canCancel
      },
      {
        value: "approve",
        action: async () => this.actions.approve(this.item),
        if: this.userIsAdmin && (this.isNew || this.isInCharge) && !this.firstMustTakeCharge
      },
      {
        value: "takeCharge",
        action: async () => this.actions.takeCharge(this.item),
        if: this.firstMustTakeCharge
      },
      {
        value: "reject",
        action: async () => this.actions.reject(this.item),
        if: this.userIsAdmin && (this.isNew || this.isInCharge)
      },
      {
        value: "downloadReceipt",
        action: async () => await this.actions.downloadReceipt(this.item.id),
        if: (!this.userIsAdmin || this.userIsSuperAdmin)
          && this.item.type === this.$enums.RequestTypes.VERSAMENTO
          && this.item.status === this.$enums.RequestStatus.ACCETTATA
      }
    ].filter(_entry => {
      return "if" in _entry ? _entry.if : true;
    });
  }

  get alwaysVisibleOptions (): CrudMenuItem[] {
    return this.menuOptions.filter(el => el.alwaysVisible && (el.if ?? true))
  }

  get alwaysGroupedOptions (): CrudMenuItem[] {
    return this.menuOptions.filter(el => !el.alwaysVisible && (el.if ?? true))
  }

  get missingAttachment () {
    let isMissing = [RequestTypes.VERSAMENTO, RequestTypes.RISC_CAPITALE].includes(this.item.type) &&
        (this.item.files?.length === 0 && this.item.hasAttachments === false)

    // only if the user is not a client and the doc is missing and request is RISC_CAPITALE OR request is VERSAMENTO
    let canUpload = (!this.$store.getters['user/userIsCliente'] && [RequestTypes.RISC_CAPITALE].includes(this.item.type)) || [RequestTypes.VERSAMENTO].includes(this.item.type)

    return isMissing && canUpload
  }

  async addAttachment () {
    try {

      await this.$alerts.askBeforeAction({
        key: 'requests.attachment',
        preConfirm: (file: File) => {
          return this.$apiCalls.requests.uploadAttachment(this.item._id, file)
        },
        settings: {
          icon: 'info',
          input: 'file',
          inputAttributes: {
            'accept': 'image/*,application/pdf',
            'aria-label': 'Contabile'
          },
          inputValidator: (file: any) => {
            return !file ? 'E\' necessario selezionare un file' : null
          }
        }
      })

      this.$emit('refresh')
    } catch (e) {
      //
    }
  }

  mounted () {
    this.actions = new RequestsTableActions(this)
  }
}
</script>

<style lang="scss">

.text-decoration-none {
  *, *:before, *:after {
    text-decoration: none !important
  }
}
</style>
