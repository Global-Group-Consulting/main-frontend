<template>
  <default-panel :title="$t('pages.forgot.title')">
    <template v-if="!formSent">
      <v-form @submit.prevent="">
        <dynamic-fieldset
          :schema="formSchema"
          v-model="formData"
          fill-row
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
          {{ $t("pages.forgot.recover-password") }}
        </v-btn>
      </div>
    </template>

    <template v-else>
      <p class="text-subtitle-1">{{ $t("pages.forgot.recover-sent") }}</p>
    </template>

    <template v-slot:actions>
      <v-btn text to="/login" small rounded>
        >  {{ $t("pages.forgot.back-to-login") }}
      </v-btn>
    </template>
  </default-panel>
</template>

<script>
  import DefaultPanel from "~/components/public/DefaultPanel";
  import DynamicFieldset from "~/components/DynamicFieldset";
  import forgotSchema from "~/config/forms/forgotSchema";

  import { computed, ref, reactive } from "@vue/composition-api";

  export default {
    layout: "public",
    auth: "guest",
    components: { DynamicFieldset, DefaultPanel },
    setup(props, { root, refs: $refs}) {
      const { $alerts, $apiCalls } = root;
      const formValid = ref(true);
      const formData = ref({
        password: "",
      });
      const formSent = ref(false);

      const formSchema = computed(forgotSchema);

      const onFormSubmit = async function () {
        try {
          if (!(await $refs["form"].validate())) {
            return;
          }

          await $apiCalls.authForgot(formData.value);

          formSent.value = true;
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
        onFormSubmit,
        onFormStatusChange,
      };
    },
  };
</script>
