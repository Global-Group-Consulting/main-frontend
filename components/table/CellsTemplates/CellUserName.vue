<template>
  <v-btn text v-if="user && (user.id || user._id)" small
         target="_blank"
         class="text-capitalize"
         color="primary"
         @click.stop
         :href="'users/profile/' + (user.id || user._id)">
    <v-icon small class="mr-2">mdi-open-in-new</v-icon>

    {{ $options.filters.userFormatter(user) }}
  </v-btn>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserName extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  get user(): User {
    return this.item.user
  }
}
</script>

<style scoped>

</style>
