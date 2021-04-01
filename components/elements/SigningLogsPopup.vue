<template>
  <v-card color="white" width="800px" :loading="gLoading">
    <v-card-title class="subtitle">
      <div style="flex-grow:1">
        {{ $t("pages.usersId.info-sign-logs-title") }}
      </div>

      <v-btn icon @click="refreshData"
             :disabled="gLoading"
             :loading="gLoading">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th>{{ $t("tables.sign-logs-user") }}</th>
            <th>{{ $t("tables.sign-logs-event") }}</th>
            <th>{{ $t("tables.sign-logs-date") }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="log of value">
            <td>{{ log.user }}</td>
            <td>{{ $t("enums.SignRequestEvents." + log.event) }}</td>
            <td>{{ log.timestamp | dateHourFormatter }}</td>
          </tr>

          <tr v-if="!value || value.length === 0">
            <td colspan="99" class="text-center">Ancora nessun informazione disponibile...</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SigningLogsPopup",
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: [],
    }
  },
  methods: {
    async refreshData() {
      try {
        const logs = await this.$apiCalls.getContractLogs(this.userId)

        this.value = logs
      } catch (e) {
        console.error(e)
      }
    }
  },
  async mounted() {
    await this.refreshData()
  }
}
</script>

<style scoped>

</style>
