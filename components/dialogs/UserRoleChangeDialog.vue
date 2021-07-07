<template>
  <div>
    <portal to="dialog-content" ref="dialogContent">
      <p v-html="$t('dialogs.confirmRoleChange.alert-msg', {roleText})" class="mb-0"></p>

      <dynamic-fieldset :schema="formSchema" v-model="formData" immediate-update/>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn text @click="onClose">
        {{ $t(`dialogs.confirmRoleChange.btn-cancel`) }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="onConfirm">
        {{ $t("dialogs.confirmRoleChange.btn-send") }}
      </v-btn>
    </portal>
  </div>
</template>


<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import DynamicFieldset from "~/components/DynamicFieldset.vue";
import {userRoleChangeDialog} from "~/config/forms/userRoleChangeSchema";
import UserRoles from "~/enums/UserRoles";
import {User} from "~/@types/UserFormData";

@Component({
  components: {DynamicFieldset: DynamicFieldset as any}
})
export default class UserRoleChangeDialog extends Vue {
  formData = {
    newAgent: "",
    commissionsReceiver: ""
  }

  get formSchema() {
    return userRoleChangeDialog(this as any)
  }

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get incomingData(): { user: User, onCancel(er:any): void, onConfirm(resp: any): void } {
    return this.dialogData.data
  }

  get roleText() {
    const roleName = UserRoles.getIdName(this.incomingData.user.role);

    return this.$t("enums.UserRoles." + roleName);
  }

  onClose() {
    if (this.incomingData.onCancel) {
      this.incomingData.onCancel({dismiss: "cancel"})
    }

    this.$store.dispatch('dialog/updateStatus', false)
  }

  onConfirm() {
    if (this.incomingData.onConfirm) {
      this.incomingData.onConfirm(this.formData)
    }

    this.$store.dispatch('dialog/updateStatus', false)
  }
}
</script>
