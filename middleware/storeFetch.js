import moment from "moment";

export default async function (app) {
  const {store, $auth} = app

  await store.restored

  const storedEnums = store.state.enums
  const storedSettings = store.state.settings

  const maxOld = null
  const settingsLastFetch = storedSettings.lastFetch
  const lastFetch = storedEnums.lastFetch
  const toFetch = []

  if (!lastFetch) {
    toFetch.push("countries")
    toFetch.push("regions")
    toFetch.push("provinces")
  }

  if (!settingsLastFetch
    || Object.keys(storedSettings.globalSettings).length === 0) {
    toFetch.push("settings")
  } else if (settingsLastFetch) {
    const lastFetchMoment = moment(settingsLastFetch)
    const diff = lastFetchMoment.diff(moment(), "minutes")

    console.log(lastFetchMoment.diff(moment(), "minutes"))
    // If the Settings where fetched more than 5 minutes ago.
    if (diff > 5 || diff < -5) {
      toFetch.push("settings")
    }
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
  if (toFetch.includes("settings")) store.dispatch("settings/fetchSettings", $auth.user)
}
