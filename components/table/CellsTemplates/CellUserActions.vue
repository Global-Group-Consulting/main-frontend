<template>
  <users-crud-actions
    :item="item"
    @userDeleted="onUserDeleted(item)"
  />
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";
import UsersCrudActions from "~/components/table/UsersCrudActions.vue";

@Component({
  components: {UsersCrudActions}
})
export default class CellUserClubPack extends Vue {
  @Prop({type: Object, required: true})
  public item!: User

  @Prop({type: Array})
  public tableData!: any

  get value() {
    return this.item.clubPack;
  }

  onUserDeleted(item: User) {
    const index = this.tableData.findIndex((_el: User) => _el.id === item.id)

    //TODO:: Sistemare la cancellazione da tabella di ricerca in quanto sono sorgenti dati diversi.

    this.$delete(this.tableData, index)
  }
}
</script>

<style scoped>

</style>
