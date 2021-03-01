export default async function ({store}) {
  const storedEnums = store.state.enums

  await store.restored

  const maxOld = null
  const lastFetch = storedEnums.lastFetch
  const toFetch = []

  if (!lastFetch) {
    toFetch.push("countries")
    toFetch.push("regions")
    toFetch.push("provinces")
  }

  if (!lastFetch.countries || storedEnums.countries.length === 0) {
    toFetch.push("countries")
  }

  if (!lastFetch.regions || storedEnums.regions.length === 0) {
    toFetch.push("regions")
  }

  if (!lastFetch.provinces || storedEnums.provinces.length === 0) {
    toFetch.push("provinces")
  }

  // Next time i need to force it i can add a maxold param, and if the date is too old, refetch the data.

  if (toFetch.includes("countries")) store.dispatch('enums/getCountries')
  if (toFetch.includes("regions")) store.dispatch('enums/getRegions')
  if (toFetch.includes("provinces")) store.dispatch('enums/getProvinces')
}
