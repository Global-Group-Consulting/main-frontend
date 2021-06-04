<template>
  <v-tooltip right v-if="item.superAdmin">
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-on="on" v-bind="attrs"
              class="d-inline-block">
        mdi-account-supervisor-circle
      </v-icon>
    </template>

    <span>Super Admin</span>
  </v-tooltip>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserSuperAdmin extends Vue {
  @Prop({type: Object, required: true})
  public item!: User
}
</script>

<style scoped>

</style>
