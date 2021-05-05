<template>
  <div class="d-inline-block">
    <component :is="invalidFields.includes(fieldKey) ? 'strong' : 'span'"
               :class="{'red&#45;&#45;text': invalidFields.includes(fieldKey)}">
      {{ labelContent }}
    </component>

    <v-tooltip top v-if="isRequired || shouldBeRequired">
      <template v-slot:activator="{ on }">
        <strong v-on="on"
                :class="requiredColor"
                style="pointer-events: all"
        >
          {{ requiredText }}
        </strong>
      </template>

      <span>{{ requiredMessage }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">

import {kebabCase as _kebabCase} from "lodash";

import {Component, Prop, Vue} from "vue-property-decorator";
import {FormSchemaField, FormSchemaValidations} from "~/@types/FormSchema";

@Component
export default class DynamicLabel extends Vue {
  @Prop({required: true, type: Object})
  public field!: FormSchemaField

  @Prop({required: true, type: String})
  public fieldKey!: string

  @Prop({type: Array, default: () => []})
  public invalidFields!: any[]


  get labelContent() {
    return this.$t("forms." + _kebabCase(this.field.label || this.fieldKey));
  }

  get isRequired() {
    const reqKeysMap: string[] = ["required", "requiredIf"]
    const validations: FormSchemaValidations = this.field.validations || {}
    let isRequired = false

    if (this.field.readonly || this.field.disabled) {
      return isRequired;
    }

    if (validations.required || (validations.requiredIf && validations.requiredIf.params())) {
      isRequired = true
    }

    return isRequired;
  }

  get shouldBeRequired() {
    const reqKeysMap: string[] = ["required", "requiredIf"]
    const validations: FormSchemaValidations = this.field.validations || {}
    let isRequired = false

    if (this.field.readonly || this.field.disabled) {
      return isRequired;
    }

    for (let validationRule in validations) {
      if (reqKeysMap.includes(validationRule || "")) {
        isRequired = true;

        break;
      }
    }

    return isRequired;
  }

  get requiredMessage() {
    return this.$t(`validators.${this.isRequired ? "required" : "shouldBeRequired"}`)
  }

  get requiredColor() {
    return this.isRequired ? "red--text" : "orange--text text--lighten-3"
  }

  get requiredText() {
    return this.isRequired ? "*" : "\""
  }
}
</script>

<style scoped>

</style>
