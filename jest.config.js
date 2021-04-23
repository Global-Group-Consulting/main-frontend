module.exports = {
  moduleNameMapper: {
    Intl: '<rootDir>/node_modules/full-icu/'
  },
  moduleFileExtensions: [
    "js",
    "json",
    // tell Jest to handle `*.vue` files
    "vue"
  ],
  transform: {
    // process `*.vue` files with `vue-jest`
    ".*\\.(vue)$": "vue-jest"
  }
};
