<template>
  <v-card class="flex-fill flex-row d-flex align-start" style="height: 100%">
    <v-icon x-large class="ml-3 mt-3" :color="data.color">
      {{ data.icon }}
    </v-icon>

    <div style="width: 100%; height: 100%" class="flex-fill d-flex flex-column">
      <v-card-title class="pb-0 text-no-wrap">
        {{ value }}
      </v-card-title>

      <v-card-text class="flex-fill">
        {{ data.title }}
        <slot name="subtitle"></slot>
      </v-card-text>

      <v-card-actions class="text-right pt-0 transparent">
        <v-btn link text small color="primary"
               v-if="data.actionText"
               @click="onAction"
               :disabled="actionIsDisabled">
          {{ data.actionText }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {CardBlockI} from "~/@types/components/CardBlock";

@Component
export default class CardBlock extends Vue {
  @Prop({type: Object, required: true})
  public data!: CardBlockI

  @Prop({type: Object})
  public extraData!: any

  get value() {
    if (this.data.value instanceof Function) {
      return this.data.value(this.data, this.extraData)
    }

    return this.data.value
  }

  get actionIsDisabled() {
    if (this.data.actionDisabled instanceof Function) {
      return this.data.actionDisabled(Object.assign({}, this.data, {
          value: this.value
        }), this.extraData
      )
    }

    return this.data.actionDisabled
  }

  public onAction() {
    if (this.data.action) {
      this.data.action(this.data)
    }
  }
}
</script>

<style scoped>

</style>
