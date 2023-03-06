module.exports = {
  moduleNameMapper: {
    Intl: '<rootDir>/node_modules/full-icu/'
  },
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    // tell Jest to handle `*.vue` files
    "vue"
  ],
  transform: {
    // process `*.vue` files with `vue-jest`
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.ts?$": "babel-jest"
  }
};
