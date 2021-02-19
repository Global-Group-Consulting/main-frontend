<template>
  <v-edit-dialog
    :return-value.sync="localValue"
    large
    :cancel-text="$t('dialogs.aclEditDialog.cancelText')"
    :save-text="$t('dialogs.aclEditDialog.saveText')"
    @save="onRoleSave"
    @cancel="onRoleCancel"
    @open="onOpen"
    @close="onClose"
  >
    <div v-if="value" class="mx-n1">
      <div v-if="!textInput">
        <v-chip
          v-for="entry of value" :key="entry"

          link
          x-small
          class="mx-1">
          {{ entry }}
        </v-chip>
      </div>

      <template v-else>{{ value }}</template>

    </div>

    <a v-else class="text-decoration-underline-dotted caption">{{ $t("dialogs.aclEditDialog.addText") }}</a>

    <template v-slot:input>
      <div class="mt-4 title">
        {{ $t(`dialogs.aclEditDialog.title${$options.filters.upperFirst(field)}`) }}
      </div>

      <v-autocomplete
        v-if="!textInput"
        multiple
        v-model="localValue"
        :items="selectData"
        clearable
        :label="$t('dialogs.aclEditDialog.select.label.' + field)"
      >
        <template v-slot:selection="{item, index}">
          <span v-if="index === 0 && localValue.length > 1"
                class="grey--text caption mr-2">
            {{ $t("dialogs.aclEditDialog.select.selection", {count: localValue.length}) }}
          </span>
          <span v-else-if="index === 0 && localValue.length === 1">{{ item.value }}</span>
        </template>

        <template v-slot:item="{item, value}">
          <div>
            <strong>
              {{ item.text }}
            </strong>

            <small class="d-block ml-2">
              {{ item.subText }}
            </small>
          </div>
        </template>
      </v-autocomplete>

      <v-text-field v-if="textInput"
                    v-model="localValue"></v-text-field>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">

import {Vue, Component, Prop,} from "vue-property-decorator";

@Component
export default class AclEditDialog extends Vue {
  @Prop({type: Object, required: true})
  cellData!: any

  @Prop({type: String, required: true})
  field!: string

  @Prop({type: Array, default: () => []})
  selectData!: any[]

  @Prop({type: Boolean, default: false})
  textInput!: boolean

  @Prop({})
  value!: any

  public localValue: string | string[] = this.value || ""

  async onRoleSave() {
    this.$emit("input", this.localValue, this.field)
  }

  async onRoleCancel() {
  }

  async onOpen() {
  }

  async onClose() {
  }
}
</script>

<style scoped>

</style>
