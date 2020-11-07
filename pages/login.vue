<template>
  <default-panel :title="$t('pages.login.title')">
    <v-form @submit.prevent="">
      <dynamic-fieldset
        :schema="formSchema"
        v-model="formData"
        fill-row
        @status="saveStatus($event)"
      />
    </v-form>

    <div class="text-center mt-4">
      <v-btn
        :disabled="!formValid"
        color="primary"
        type="submit"
        @click="onFormSubmit"
        v-if="!recover"
      >
        {{ $t("pages.login.log-in") }}
      </v-btn>

      <div v-else class="d-flex">
        <v-btn to="/accountLogin" text>
          {{ $t("pages.login.back-to-login") }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn :disabled="!formValid" color="primary" type="submit">
          {{ $t("pages.login.recover-password") }}
        </v-btn>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn text to="/auth/forgot" small>
        {{ $t("pages.login.forgot-password") }}
      </v-btn>
    </template>
  </default-panel>
</template>

<script>
  import DefaultPanel from "~/components/public/DefaultPanel";
  import DynamicFieldset from "~/components/DynamicFieldset";

  import loginSchema from "~/config/forms/loginSchema";

  import { computed, ref } from "@vue/composition-api";

  export default {
    layout: "public",
    auth: "guest",
    components: { DynamicFieldset, DefaultPanel },

    setup(props, { root }) {
      const { $enums } = root;
      const formData = ref({
        email: "",
        password: "",
      });

      const formSchema = computed((context) => ref(loginSchema(context)));

      return {
        formData,
        formSchema,
      };
    },
    data() {
      return {
        formValid: true,
        recover: false,
      };
    },
    methods: {
      saveStatus(state) {
        this.formValid = !state.invalid;
      },
      async onFormSubmit() {
        // first must be validate

        try {
          this.$auth.reset();

          await this.$auth.loginWith("refreshScheme", { data: this.formData });
        } catch (e) {
          this.$alerts.error(e);
        }
      },
    },
  };
</script>

<style scoped>

</style>
