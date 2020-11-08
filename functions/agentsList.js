import { computed, onMounted, ref } from "@vue/composition-api";

export default function () {
  const list = ref([])

  onMounted(async () => {
    try {
      // const result = await $axios.fetchAgents()

      // $set(list, "value", result)
    } catch (er) {
      console.error(er)
    }

  })

  return {
    list
  }
}
