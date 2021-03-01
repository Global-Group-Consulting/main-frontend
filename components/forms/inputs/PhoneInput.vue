<template>
  <div class="d-flex">
    <v-autocomplete :items="countriesPhoneCodeList"
                    hide-details
                    class="mr-1"
                    single-line
                    style="max-width: 100px;min-width:100px;"
                    v-model="prefix"
                    @input="onInput"
    >
      <template v-slot:selection="{item}">
        <span class="text-nowrap">
        {{ item.value }}
        </span>
      </template>
    </v-autocomplete>

    <v-text-field
      ref="input"
      v-bind="$attrs"
      v-model="number"
      @input="onInput"
    >
      <template v-slot:label>
        <slot name="label"></slot>
      </template>

    </v-text-field>

  </div>

</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from "vue-property-decorator"

interface SelectItem {
  value?: string,
  text?: string
}


@Component
export default class PhoneInput extends Vue {
  @Prop({type: [String, Number]})
  value!: string

  number: string = ""
  prefix: string = ""

  get countriesPhoneCodeList() {
    return this.$store.getters['enums/countriesPhoneCodeList']
  }

  @Watch("value", {immediate: true})
  onValueChange(value: any) {
    if (typeof value !== "string") {
      value = value?.toString() || ""
    }

    const prefix = this.countriesPhoneCodeList.find((country: any) => value.startsWith(country.value.toString()))

    if (prefix) {
      this.prefix = prefix.value
      this.number.replace(prefix.value, "")
    }
  }

  onInput() {
    this.$emit("change", (this.prefix?.toString() || "") + (this.number?.toString() || ""))
  }

}
</script>

<style scoped>

</style>
