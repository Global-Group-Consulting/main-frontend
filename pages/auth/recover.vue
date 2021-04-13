<template>
  <default-panel :title="$t('pages.recover.title')">
    <template v-if="!formSent">
      <v-form @submit.prevent="">
        <dynamic-fieldset
          :schema="formSchema"
          v-model="formData"
          fill-row
          immediateUpdate
          ref="form"
          @status="onFormStatusChange"
        />
      </v-form>

      <div class="text-center mt-4">
        <v-btn
          color="primary"
          type="submit"
          rounded
          :loading="gLoading"
          @click="onFormSubmit"
        >
          {{ $t("pages.recover.recover-password") }}
        </v-btn>
      </div>
    </template>

    <template v-else>
      <p class="text-subtitle-1">{{ $t("pages.recover.recover-success") }}</p>
      <v-progress-linear :value="countdownTimer"></v-progress-linear>
    </template>

    <template v-slot:actions v-if="!formSent">
      <v-btn text to="/login" small rounded>
        > {{ $t("pages.recover.back-to-login") }}
      </v-btn>
    </template>
  </default-panel>
</template>

<script>
import DefaultPanel from "~/components/public/DefaultPanel";
import DynamicFieldset from "~/components/DynamicFieldset";
import recoverSchema from "~/config/forms/recoverSchema";

import {computed, ref, reactive} from "@vue/composition-api";

export default {
  layout: "public",
  auth: "guest",
  name: "recover",
  components: {DynamicFieldset, DefaultPanel},
  setup(props, {root, refs: $refs}) {
    const {$alerts, $apiCalls, $route, $router, $auth} = root;
    const formValid = ref(false);
    const formData = ref({
      password: "",
      password_confirmation: "",
      token: $route.query.t,
    });
    const formSent = ref(false);
    const countdownTimer = ref(0);

    const formSchema = computed(recoverSchema);

    /**
     *
     * @param {{token: string, refreshToken: string}} result
     */
    const startCountdown = function (result) {
      const interval = setInterval(async () => {
        countdownTimer.value++;

        if (countdownTimer.value >= 100) {
          clearInterval(interval);

          await $auth.setUserToken(result.token, result.refreshToken);
        }
      }, 50);
    };

    const onFormSubmit = async function () {
      try {
        if (!(await $refs["form"].validate())) {
          return;
        }

        const result = await $apiCalls.authRecover(formData.value);

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
