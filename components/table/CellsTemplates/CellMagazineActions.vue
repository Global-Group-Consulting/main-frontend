<template>
  <table-actions :menu-options="menuOptions"></table-actions>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {CrudMenuItem} from "~/@types/Tables/CrudMenuItem";
import TableActions from "~/components/elements/TableActions.vue";
import {IMagazine} from "~/@types/Magazine";

@Component({
  components: {TableActions}
})
export default class CellMagazineActions extends Vue {
  @Prop({type: Object, default: () => ({})})
  item!: IMagazine

  get menuOptions(): CrudMenuItem[] {
    return [
      {
        value: this.$t("menus.magazine.show-pdf") as string,
        action: async () => this.showPdf(),
        alwaysVisible: true,
        color: "primary",
        icon: "mdi-book-open-outline",
      },
      {
        value: this.$t("menus.magazine.edit") as string,
        action: async () => this.edit(),
        alwaysVisible: true,
        color: "orange lighten-2",
        icon: "mdi-book-edit"
      },
      {
        value: this.$t("menus.magazine.delete") as string,
        action: async () => this.delete(),
        icon: "mdi-book-remove"
      },
    ];
  }

  async showPdf() {
    await this.$store.dispatch("dialog/updateStatus", {
      id: "MagazineFilePreviewer",
      title: this.item.title,
      fullscreen: false,
      data: {
        fileId: this.item.fileId
      }
    })
  }

  async edit() {
    await this.$store.dispatch("dialog/updateStatus", {
      title: this.$t("dialogs.magazine.title-edit"),
      id: "MagazineDialog",
      texts: {
        confirmBtn: "dialogs.magazine.btn-save",
        cancelBtn: "dialogs.magazine.btn-cancel",
      },
      data: {
        magazine: this.item
      }
    });
  }

  async delete() {
    try {
      await this.$alerts.askBeforeAction({
        key: "magazine.delete",
        data: this.item,
        settings: {
          confirmButtonColor: "red"
        },
        preConfirm: async () => {
          try {
            await this.$apiCalls.magazine.delete(this.item.id);

            await this.$store.dispatch("magazine/fetch");
          } catch (er) {
            this.$alerts.error(er);
          }
        }
      });
    } catch (er) {
      this.$alerts.error(er);
    }
  }

}
</script>
