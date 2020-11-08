<template>
  <default-panel :title="$t('pages.login.title')">
    <v-form @submit.prevent="">
      <dynamic-fieldset
        :schema="formSchema"
        v-model="formData"
        fill-row
        ref="loginForm"
        @status="saveStatus($event)"
      />
    </v-form>

    <div class="text-center mt-4">
      <v-btn
        :disabled="!formValid"
        color="primary"
        type="submit"
        :loading="gLoading"
        @click="onFormSubmit"
      >
        {{ $t("pages.login.log-in") }}
      </v-btn>
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

    head() {
      return {
        title: "Login",
      };
    },
    setup(props, { root, refs: $refs }) {
      const { $enums } = root;
      const formData = ref({
        email: "",
        password: "",
      });

      const formSchema = computed((context) => ref(loginSchema(context)));

      const onFormSubmit = async function () {
        if (!(await $refs["loginForm"].validate())) {
          return;
        }

        this.gLoadingUpdate();

        try {
          this.$auth.reset();

          await this.$auth.loginWith("refreshScheme", { data: this.formData });
        } catch (e) {
          this.$alerts.error(e);
        }

        this.gLoadingUpdate(false);
      };

      return {
        formData,
        formSchema,
        onFormSubmit,
      };
    },
    data() {
      return {
        formValid: false,
        recover: false,
      };
    },
    methods: {
      saveStatus(state) {
        this.formValid = !state.invalid;
      },
    },
  };
</script>

<style scoped>

</style>
