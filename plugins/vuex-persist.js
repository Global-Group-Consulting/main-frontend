import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    reducer: (state) => ({
      auth: state.auth,
      enums: state.enums,
      i18n: state.i18n,
    }),
  }).plugin(store)
}
