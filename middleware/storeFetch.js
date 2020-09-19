export default async function ({ store }) {
  const storedEnums = store.state.enums

  await store.restored

  if (storedEnums.countries.length === 0) store.dispatch('enums/getCountries')
  if (storedEnums.regions.length === 0) store.dispatch('enums/getRegions')
  if (storedEnums.provinces.length === 0) store.dispatch('enums/getProvinces')
}
