<template>
  <v-layout>
    <v-flex>
      <page-header page-name="settings"/>

      <v-form ref="mainForm" @submit="onFormSubmit">
        <v-card elevation="1">
          <v-card-title>{{ $t("pages.settings.globalSettings") }}</v-card-title>
          <v-card-text>
            <dynamic-fieldset
              :schema="formGlobalSchema"
              v-model="globalSettingsData"
              ref="globalSettingsForm"
            />
          </v-card-text>
        </v-card>

        <!-- Floating action button -->
        <v-fab-transition>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                slot="activator"
                v-on="on"
                color="green"
                fixed
                dark
                bottom
                right
                fab
                type="button"
                :loading="gLoading"
                @click="onFormSubmit"
                :style="$vuetify.breakpoint.xsOnly ? 'bottom: calc(76px + var(--sab));' : '' "
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("pages.usersId.btn-save") }}</span>
          </v-tooltip>
        </v-fab-transition>
      </v-form>
    </v-flex>
  </v-layout>

</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {merge} from "lodash";

import PageHeader from "../components/blocks/PageHeader.vue";
import {SettingPermissions} from "~/functions/acl/enums/setting.permissions";
import {globalSettings} from "~/config/forms/settingsSchema";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import SettingTypes from "~/enums/SettingTypes";

interface SettingData {
  name: string
  value: any
  type: string
}

@Component({
  components: {DynamicFieldset, PageHeader},
  meta: {
    permissions: [SettingPermissions.SETTINGS_ALL_READ, SettingPermissions.SETTINGS_SELF_READ]
  },
})
export default class Settings extends Vue {
  public globalSettingsData: any = {};
  public userSettingsData: any = {};

  $refs!: {
    globalSettingsForm: typeof DynamicFieldset
  }

  get formGlobalSchema() {
    return globalSettings(this)
  }

  get storedGlobalSettings() {
    return this.$store.getters["settings/globalSettings"]
  }

  get storedUserSettings() {
    return this.$store.getters["settings/userSettings"]
  }

  updateSettingsData(oldData: any, newData: Record<string, SettingData>) {
    for (let key in newData) {
      this.$set(oldData, key, newData[key])
    }
  }

  async onFormSubmit() {
    await this.saveGlobalSettings()
    //await this.saveUserSettings()
  }

  async saveGlobalSettings() {
    if (!(await this.$refs.globalSettingsForm.validate())) {
      return
    }

    const data: any[] = Object.entries(this.globalSettingsData).reduce((acc, entry) => {
      const key = entry[0];
      const value = entry[1];

      acc.push({
        name: key,
        value: value,
      })

      return acc
    }, [])

    try {
      const result = await this.$apiCalls.saveSettings(data);

      await this.$store.dispatch("settings/updateSettings", {data: Object.values(result), type: SettingTypes.GLOBAL})
    } catch (er) {
      this.$alerts.error(er)
    }
  }

  async saveUserSettings() {
    // for now avoid saving users settings
  }


  async mounted() {
    try {
      await this.$store.dispatch("settings/fetchSettings", this.$auth.user)

      this.updateSettingsData(this.globalSettingsData, this.storedGlobalSettings)
      this.updateSettingsData(this.userSettingsData, this.storedUserSettings)
    } catch (e) {
      this.$alerts.error(e)
    }
  }

}
</script>

<style scoped>

</style>
