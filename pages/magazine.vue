<template>
  <v-layout>
    <v-flex>
      <page-header page-name="magazine"/>

      <div class="d-flex mb-4">
        <div class="mr-4">
          <div style="width: 100px">
            <MagazineCard skeleton-height="100px"/>
          </div>
        </div>

        <div v-if="currentMagazine">
          <h2>Magazine in corso</h2>
          <h3>{{ currentMagazine.title }}</h3>
          <h4>In evidenza dal {{ currentMagazine.showFrom|dateFormatter }} al {{
              currentMagazine.showUntil|dateFormatter
            }}</h4>
        </div>
      </div>

      <page-toolbar :actions-list="actionsList"/>

      <v-card>
        <data-table schema="magazineSchema" table-key="magazine" :items="tableItems">
          <template v-slot:item.publicationDate="{value}">
            {{ $moment(value).format("MMMM YYYY") }}
          </template>

          <template v-slot:item.showRange="{item}">
            {{ item.showFrom|dateFormatter }} - {{ item.showUntil|dateFormatter }}
          </template>
        </data-table>
      </v-card>

    </v-flex>

    <magazine-dialog v-if="$store.getters['dialog/dialogId'] === 'MagazineDialog'"></magazine-dialog>

    <file-preview-dialog v-if="$store.getters['dialog/dialogId'] === 'MagazineFilePreviewer'"></file-preview-dialog>
  </v-layout>
</template>


<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {AclPermissions} from "~/functions/acl/enums/acl.permissions";
import DataTable from "~/components/table/DataTable.vue";
import {IMagazine} from "~/@types/Magazine";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import PageHeader from "~/components/blocks/PageHeader.vue";
import {ActionItem} from "~/@types/ActionItem";
import MagazineDialog from "~/components/dialogs/MagazineDialog.vue";
import FilePreviewDialog from "~/components/dialogs/FilePreviewDialog.vue";
import MagazineCard from "~/components/dashboard/MagazineCard.vue";

@Component({
  components: {MagazineCard, FilePreviewDialog, MagazineDialog, PageHeader, PageToolbar, DataTable},
  meta: {
    permissions: [AclPermissions.ACL_ACL_READ, AclPermissions.ACL_ACL_WRITE]
  }
})
export default class Magazine extends Vue {
  get currentMagazine(): IMagazine {
    return this.$store.getters["magazine/currentMagazine"];
  }

  get actionsList(): ActionItem[] {
    return [
      {
        text: "magazine.add",
        icon: "mdi-book-plus",
        position: "center",
        click: () => this.onAddClick(),
      }
    ]
  }

  get tableItems(): IMagazine[] {
    return this.$store.getters["magazine/magazines"];
  }

  onAddClick() {
    this.$store.dispatch("dialog/updateStatus", {
      title: this.$t("dialogs.magazine.title-new"),
      id: "MagazineDialog",
      texts: {
        confirmBtn: "dialogs.magazine.btn-submit",
        cancelBtn: "dialogs.magazine.btn-cancel",
      }
    });
  }

  mounted() {
    this.$store.dispatch("magazine/fetch")
  }
}
</script>
