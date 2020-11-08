<template>
  <div class="dynamic-fieldset">
    <div
      v-for="(row, index) in schema.value || schema"
      :key="index"
      v-if="row.hasOwnProperty('if') ? row.if : true"
    >
      <h3 class="primary--text mt-5" v-if="row.legend">
        {{ $t("forms." + row.legend) }}
      </h3>

      <v-row>
        <v-col
          v-bind="getColumns(row)"
          v-for="(field, key, fieldIndex) in row.cols"
          v-if="field.hasOwnProperty('if') ? field.if : true"
          :key="key"
        >
          <component
            :is="field.component || 'v-text-field'"
            v-bind="field"
            :items="translateItems(field)"
            :value="getValue(field, key)"
            :field-key="key"
            :ref="`comp_${key}_${index}_${fieldIndex}`"
            :error-messages="errorMessages[key]"
            :class="{ 'edit-mode': editMode && !row.disableEditMode }"
            :edit-mode="editMode && !row.disableEditMode"
            @change="update(key, $event)"
          >
            <template v-slot:label>
              {{ getLabel(key) }}

              <v-tooltip
                top
                v-if="
                  field.validations &&
                  field.validations.required &&
                  !(field.readonly || field.disabled)
                "
              >
                <template v-slot:activator="{ on }">
                  <strong
                    class="red--text"
                    v-on="on"
                    style="pointer-events: all"
                  >
                    *
                  </strong>
                </template>
                <span>{{ $t("validators.required") }}</span>
              </v-tooltip>
            </template>

            <template v-slot:prepend v-if="editMode && !row.disableEditMode">
              <v-checkbox
                :disabled="field.disabled || field.readonly"
              ></v-checkbox>
            </template>
          </component>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import { VTextField, VTextarea, VSelect, VFileInput } from "vuetify/lib";
  import DatePicker from "@/components/forms/inputs/DatePicker";
  import MoneyInput from "@/components/forms/inputs/MoneyInput";
  import FileUploader from "@/components/forms/inputs/FileUploader";
  import ContractSign from "@/components/hompage/activationWizard/ContractSign";

  import { validationRules, errorMessages } from "@/mixins/ValidationsParser";
  import { validationMixin } from "vuelidate";
  import { kebabCase as _kebabCase, get as _get } from "lodash";

  import { onMounted, reactive, ref, watch } from "@vue/composition-api";

  export default {
    name: "DynamicFieldset",
    components: {
      VTextField,
      VSelect,
      DatePicker,
      VFileInput,
      ContractSign,
      VTextarea,
      MoneyInput,
      FileUploader,
    },
    mixins: [validationMixin],
    validations() {
      return {
        form: validationRules(this.schema.value || this.schema),
      };
    },
    props: {
      schema: {
        type: Array | Object,
        required: true,
      },
      value: {
        type: Object,
        default: () => ({}),
      },
      fillRow: Boolean,
      editMode: Boolean,
    },
    setup(props, { root }) {
      const { $set } = root;
      const form = reactive({});

      watch(
        () => props.value,
        (value) => {
          if (!props.schema.value) {
            // throw new Error("The schema provided is not a reactive element");
          }

          for (let { cols } of props.schema.value || props.schema) {
            for (let name in cols) {
              $set(form, name, value[name]);
            }
          }
        },
        { deep: true, immediate: true }
      );

      return {
        form,
      };
    },
    computed: {
      errorMessages,
    },
    methods: {
      getColumns(row) {
        if (Object.keys(row.cols).length === 1 && this.fillRow) {
          return;
        }

        return {
          cols: "12",
          sm: "6",
          lg: "4",
        };
      },
      getValue(field, key) {
        let value = this.value[key];

        if (field.formatter) {
          if (typeof field.formatter === "function") {
            value = field.formatter(value);
          } else if (this.$options.filters[field.formatter]) {
            value = this.$options.filters[field.formatter](
              value,
              field.formatterParams
            );
          }
        }

        return value;
      },
      getLabel(key) {
        return this.$t("forms." + _kebabCase(key));
      },
      translateItems(field) {
        if (!field.items) {
          return;
        }

        if (typeof field.items === "string") {
          return _get(this.$store.getters, field.items.replace(/\./g, "/"));
        }

        if (field.items instanceof Array) {
          return field.items;
        }

        const enumInstance = field.items;
        const enumName = enumInstance.enumName;

        return enumInstance.list.map((item) => {
          item.id = item.text;
          item.text = this.$t(`enums.${enumName}.${item.id}`);

          return item;
        });
      },
      update(key, value) {
        const mustValidate = !!this.$v.form[key];

        console.log("UPDATING");

        // stores the new value
        this.form[key] = value;

        // trigger touch only if must be validated
        mustValidate && this.$v.form[key].$touch();

        this.$emit("input", {
          ...this.value,
          [key]: value,
        });

        // announce validation statu only if must be validated
        mustValidate && this.announceStatus();
      },

      announceStatus() {
        this.$emit("status", {
          invalid: this.$v.$invalid,
        });
      },

      scrollToFirstError() {
        const refs = Object.entries(this.$refs).filter((_entry) => {
          const key = _entry[0];
          const value = _entry[1][0];

          const regExp = new RegExp(
            Object.keys(this.errorMessages)
              .map((_errKey) => "comp_" + _errKey)
              .join("|")
          );

          if (key.match(regExp)) {
            return true;
          }

          return false;
        });
        const firstErrorField = refs[0][1];

        this.$scrollTo(firstErrorField[0].$el);
      },

      /**
       * @param {boolean} scrollTo
       * @param {boolean} returnErrors
       * @returns {boolean | {}}
       */
      async validate(scrollTo = true, returnErrors = false) {
        this.$v.$touch();
        this.announceStatus();
        const withErrors = Object.keys(this.errorMessages).length > 0;

        if (scrollTo && withErrors) {
          this.scrollToFirstError();
        }

        if (returnErrors) {
          return this.errorMessages;
        } else {
          return !withErrors;
        }
      },
    },
  };
</script>

<style scoped lang="scss">
.dynamic-fieldset::v-deep {
  .edit-mode {
    .v-input__prepend-outer {

      .v-input--checkbox {
        margin-top: 0;
        padding-top: 0;
      }
    }
  }
}
</style>
