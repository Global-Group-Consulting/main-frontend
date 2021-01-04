<template>
  <v-text-field
    ref="passwordInput"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
    v-on="$listeners"
    :loading="checkPasswordStrength"
    @input="onPasswordInput"
    @click:append="showPassword = !showPassword"
  >
    <template v-slot:label>
      <slot name="label"></slot>
    </template>

    <template v-slot:progress>
      <v-progress-linear
        :value="progress"
        :color="color"
        absolute
        height="4"
      ></v-progress-linear>
    </template>
  </v-text-field>
</template>

<script>
import zxcvbn from "zxcvbn"

export default {
  name: "PasswordInput",
  props: {
    checkPasswordStrength: Boolean
  },
  data() {
    return {
      showPassword: false,
      passwordStrength: -1
    }
  },
  computed: {
    progress() {
      return Math.floor((this.passwordStrength + 1) / 5 * 100);
    },
    color() {
      return this.passwordStrength > -1 ? ['red', 'orange', 'yellow', 'lime', 'green'][this.passwordStrength] : "red"
    },
  },
  methods: {
    onPasswordInput(value) {
      const result = zxcvbn(value)

      this.passwordStrength = result.score
    }
  }
}
</script>

<style scoped>

</style>
