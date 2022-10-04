module.exports = {
  extends: [
    // 'plugin:vue/eslint-plugin-vue',
  ],
  rules: {
    // override/add rules settings here, such as:
    //  'vue/no-unused-vars': 'error'
    'vue/valid-v-slot': ['warn', { allowModifiers: false }]
  }
}
