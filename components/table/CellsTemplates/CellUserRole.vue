<template>
  <v-chip
    small
    dark
    :color="$enums.UserRoles.get(item.role).color"
  >
    {{
      $t("enums.UserRoles." + $enums.UserRoles.getIdName(item.role))
    }}
  </v-chip>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserRole extends Vue {
  @Prop({type: Object, required: true})
  public item!: User
}
</script>

<style scoped>

</style>
