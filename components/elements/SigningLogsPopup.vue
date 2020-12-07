<template>
  <v-card color="white" width="800px">
    <v-card-title class="subtitle"> {{ $t("pages.usersId.info-sign-logs-title") }}</v-card-title>
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
    value: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
