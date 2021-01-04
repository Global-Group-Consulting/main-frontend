<template>
  <default-panel :title="$t('pages.activate.title')">
    <template v-if="!formSent">
      <v-form @submit.prevent="">
        <dynamic-fieldset
          :schema="formSchema"
          v-model="formData"
          fill-row
          @status="onFormStatusChange"
        />
      </v-form>

      <div class="text-center mt-4">
        <v-btn
          :disabled="!formValid"
          color="primary"
          type="submit"
          rounded
          :loading="gLoading"
          @click="onFormSubmit"
        >
          {{ $t("pages.activate.recover-password") }}
        </v-btn>
      </div>
    </template>

    <template v-else>
      <p class="text-subtitle-1">{{ $t("pages.activate.recover-success") }}</p>
      <v-progress-linear :value="countdownTimer"></v-progress-linear>
    </template>
  </default-panel>
</template>

<script>
import DefaultPanel from "~/components/public/DefaultPanel";
import DynamicFieldset from "~/components/DynamicFieldset";
import activateSchema from "~/config/forms/activateSchema";

import {computed, ref, reactive} from "@vue/composition-api";

export default {
  layout: "public",
  auth: "guest",
  components: {DynamicFieldset, DefaultPanel},
  setup(props, {root}) {
    const {$alerts, $apiCalls, $route, $router, $auth} = root;
    const formValid = ref(false);
    const formData = ref({
      password: "",
      password_confirmation: "",
      token: $route.query.t,
    });
    const formSent = ref(false);
    const countdownTimer = ref(0);

    const formSchema = computed(activateSchema);

    const startCountdown = function (result) {
      const interval = setInterval(() => {
        countdownTimer.value++;

        if (countdownTimer.value >= 100) {
          clearInterval(interval);

          $auth.setUserToken(result);

          $router.replace("/", true);
        }
      }, 50);
    };

    const onFormSubmit = async function () {
      try {
        const result = await $apiCalls.authActivate(formData.value);

        formSent.value = true;
        startCountdown(result);
      } catch (er) {
        $alerts.error(er);
      }
    };

    const onFormStatusChange = function (status) {
      formValid.value = !status.invalid;
    };

    return {
      formData,
      formSchema,
      formValid,
      formSent,
      countdownTimer,
      onFormSubmit,
      onFormStatusChange,
    };
  },
};
</script>
