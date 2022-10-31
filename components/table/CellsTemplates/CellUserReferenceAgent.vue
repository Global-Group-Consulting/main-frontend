<template>
  <div v-if="!readonly && refAgentId">
    <!-- Case item.referenceAgent is same as userId and is the same as auth.user.id - Tu -->
    <div v-if="refAgentId === $auth.user.id && refAgentId === (item.id || item._id)">
      <v-btn text disabled small>Tu</v-btn>
    </div>

    <!-- Case refAgentId is same as userId but is different from auth.user.id - Utente attuale -->
    <div v-else-if="refAgentId !== $auth.user.id && refAgentId === (item.id || item._id)">
      <v-btn text disabled small>Utente attuale</v-btn>
    </div>

    <!-- Case refAgentId is different from userId and from auth.user.id -  -->
    <v-btn text
           v-else-if="refAgentData && refAgentId !== $auth.user.id && refAgentId !== (item.id || item._id)"
           small
           target="_blank"
           class="text-capitalize"
           color="primary"
           :href="refAgentUrl">
      <v-icon small class="mr-2">mdi-open-in-new</v-icon>
      {{ refAgentName }}
    </v-btn>
  </div>

  <div v-else>
    {{ refAgentName }}
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserReferenceAgent extends Vue {
  @Prop({type: Object, required: true})
  public item!: any

  @Prop({type: Boolean, default: false})
  public readonly!: boolean

  get user(): User {
    if ("user" in this.item) {
      return this.item.user
    }

    return this.item
  }

  get refAgentId(): string | null {
    return this.user?.referenceAgent
  }

  get refAgentData(): User | null {
    return this.user?.referenceAgentData
  }

  get refAgentUrl(): string {
    if (!this.refAgentData) {
      return "#"
    }

    return '/users/profile/' + (this.refAgentData?.id || this.refAgentData?._id)
  }

  get refAgentName(): string {
    if (!this.refAgentData) {
      return ""
    }

    return this.refAgentData?.firstName + " " + this.refAgentData?.lastName
  }
}
</script>

<style scoped>

</style>
