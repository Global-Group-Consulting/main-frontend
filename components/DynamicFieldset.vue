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
          :class="row.class || 'pb-0'"
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
              <component :is="invalidFields.includes(key) ? 'strong' : 'span'"
                         :class="{'red--text': invalidFields.includes(key)}">
                {{ getLabel(field.label || key) }}
              </component>

              <v-tooltip
                top
                v-if="field.validations
                  && (field.validations.required || field.validations.requiredIf && field.validations.requiredIf.params())
                  && !(field.readonly || field.disabled)
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

            <template v-slot:prepend v-if="(editMode && !row.disableEditMode) || invalidFields.includes(key)">
              <v-layout align-items-start>
                <v-checkbox
                  v-if="editMode && !row.disableEditMode"
                  color="red"
                  :ripple="false"
                  :disabled="field.disabled || field.readonly"
                  :hide-details="true"
                  @change="onFieldChecked(key, $event)"
                ></v-checkbox>

                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-icon color="red" v-if="invalidFields.includes(key)" v-on="on">mdi-alert</v-icon>
                  </template>

                  <span>{{ $t("pages.usersId.info-incomplete-single-field") }}</span>
                </v-tooltip>
              </v-layout>
            </template>
          </component>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import {VTextField, VTextarea, VSelect, VFileInput} from "vuetify/lib";
import DatePicker from "@/components/forms/inputs/DatePicker";
import MoneyInput from "@/components/forms/inputs/MoneyInput";
import FileUploader from "@/components/forms/inputs/FileUploader";
import ReceiversCombobox from "@/components/forms/inputs/ReceiversCombobox";
import ContractDoc from "@/components/forms/inputs/ContractDoc";
import AgentCommissionsSelect from "@/components/forms/inputs/AgentCommissionsSelect";

import {validationRules, errorMessages} from "@/mixins/ValidationsParser";
import {validationMixin} from "vuelidate";
import {kebabCase as _kebabCase, get as _get} from "lodash";

import {onMounted, reactive, ref, watch} from "@vue/composition-api";

export default {
  name: "DynamicFieldset",
  components: {
    VTextField,
    VSelect,
    DatePicker,
    VFileInput,
    VTextarea,
    MoneyInput,
    FileUploader,
    ReceiversCombobox,
    ContractDoc,
    AgentCommissionsSelect
  },
  mixins: [validationMixin],
  validations() {
    return {
      form: validationRules(this.schema.value || this.schema)
    };
  },
  props: {
    schema: {
      type: Array | Object,
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    },
    invalidFields: {
      type: Array,
      default: () => ([])
    },
    fillRow: Boolean,
    editMode: Boolean
  },
  setup(props, {root}) {
    const {$set} = root;
    const form = reactive({});
    const checkedFields = ref([])

    watch(
      () => props.value,
      value => {
        if (!props.schema.value) {
          // throw new Error("The schema provided is not a reactive element");
        }


        for (let {cols} of props.schema.value || props.schema) {
          for (let name in cols) {
            $set(form, name, value[name]);
          }
        }
      },
      {deep: true, immediate: true}
    );

    return {
      form,
      checkedFields
    };
  },
  computed: {
    errorMessages
  },
  methods: {
    getColumns(row) {
      if (Object.keys(row.cols).length === 1 && this.fillRow) {
        return;
      }

      const toReturn = {
        cols: "12",
        sm: "6",
        lg: "4"
      };

      if (row.maxCols) {
        toReturn.lg = 12 / row.maxCols;
      }

      return toReturn;
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

      return enumInstance.list.map(item => {
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
        [key]: value
      });

      // announce validation statu only if must be validated
      mustValidate && this.announceStatus();
    },

    onFieldChecked(key, value) {
      if (value) {
        this.checkedFields.push(key)
      } else {
        this.checkedFields.splice(this.checkedFields.indexOf(key), 1)
      }

      this.$emit("checkedFieldsChange", this.checkedFields)
    },

    announceStatus() {
      this.$emit("status", {
        invalid: this.$v.$invalid
      });
    },

    scrollToFirstError() {
      const refs = Object.entries(this.$refs).filter(_entry => {
        const key = _entry[0];
        const value = _entry[1][0];

        const regExp = new RegExp(
          Object.keys(this.errorMessages)
            .map(_errKey => "comp_" + _errKey)
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

    reset() {
      this.$v.$reset();
      this.announceStatus();
    }
  }
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
