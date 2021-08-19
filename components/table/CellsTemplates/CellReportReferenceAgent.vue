<template>
  <v-btn text
         v-if="refAgentData"
         small
         target="_blank"
         class="text-capitalize"
         color="primary"
         :href="refAgentUrl">
    <v-icon small class="mr-2">mdi-open-in-new</v-icon>
    {{ refAgentName }}
  </v-btn>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import BasicCell from "~/components/table/CellsTemplates/BasicCell.vue";
import {User} from "~/@types/UserFormData";

@Component
export default class CellReportReferenceAgent extends BasicCell {
  @Prop({type: Object, required: true})
  public item!: any

  get user(): User {
    if ("user" in this.item) {
      return this.item.user
    }

    return this.item
  }

  get refAgentData(): User | null {
    return this.user?.referenceAgentData
  }

  get refAgentUrl(): string {
    if (!this.refAgentData) {
      return "#"
    }

    return '/users/profile/' + this.refAgentData?.id
  }

  get refAgentName(): string {
    if (!this.refAgentData) {
      return ""
    }

    return this.refAgentData?.firstName + " " + this.refAgentData?.lastName
  }

}
</script>
