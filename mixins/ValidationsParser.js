import * as Validators from 'vuelidate/lib/validators';
import { helpers } from 'vuelidate/lib/validators';
import { moneyFormatter } from '~/plugins/filters/moneyFormatter';

Validators.phoneNumber = (value) => {
  if (!value) {
    return true;
  }
  /**
   * @type {string}
   */
  const valueToTest = value.toString().replace(/ /g, "");

  return !!valueToTest.match(/(\+[0-9]{2}[0-9]{5,})/g);
};

Validators.multipleOf = ({ step, until }) => helpers.withParams(
  { type: 'multipleOf', step: step, until: moneyFormatter(until) },
  (value) => {
    if (!value || !step || (until && value > until)) {
      return true;
    }

    const numValue = +value;

    if (isNaN(numValue)) {
      return false;
    }

    return value % step === 0;
  }
);

export const validationRules = schema => {
  const toReturn = {};

  for (const { cols } of schema) {
    const rulesToReturn = Object.keys(cols).reduce((rules, elementName) => {
      const item = cols[elementName];

      if (!item.hasOwnProperty('validations')) return rules;

      const validations = {};
      for (let rule in item.validations) {
        const params = item.validations[rule].params;

        if (params) {
          validations[rule] = Validators[rule](params);
        } else {
          validations[rule] = Validators[rule];
        }
      }

      rules[elementName] = validations
      return rules
    }, {})

    Object.assign(toReturn, rulesToReturn)
  }

  return toReturn
}

export function errorMessages() {
  const validations = this.$v.form

  return Object.keys(validations.$params).reduce((messages, key) => {
    const rules = validations[key].$params
    const rulesKeys = Object.keys(rules)
    const validator = validations[key]

    if (!validator) return messages

    for (let rule of rulesKeys) {
      if (validator[rule] !== false || !validator.$dirty) continue

      messages[key] = this.$t('validators.' + rule, validator.$params[rule])
      return messages
    }

    return messages
  }, {})
}
