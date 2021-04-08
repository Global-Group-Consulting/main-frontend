<template>
  <div>
    <div>
      <slot name="label" v-if="previewOnly">
      </slot>
      <v-menu offset-y bottom
              v-if="userId && !contractImported"
              :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-on="on" v-bind="attrs" x-small color="info">
            <v-icon small>mdi-information-outline</v-icon>
          </v-btn>
        </template>

        <signing-logs-popup :user-id="userId"></signing-logs-popup>
      </v-menu>
    </div>

    <v-list dense class="pt-0">
      <template v-for="(file, index) in filesList">
        <v-divider :key="index" v-if="index > 0"></v-divider>

        <v-list-item
          :id="`fileListItem_${file._id}`"
          :key="file._id"
          dense
          @click="openFile(file)"
          :title="`${$t('forms.tooltip-download-file')}: ${file.clientName}`"
        >
          <v-icon small class="mr-1">mdi-file</v-icon>
          <span class="text-truncate text-no-wrap">
            {{ file.clientName }}
          </span>
          <v-spacer></v-spacer>

          <v-btn
            icon
            @click.prevent="downloadFile(file, $event)"
            :title="$t('forms.tooltip-download-file')"
          >
            <v-icon small>mdi-download</v-icon>
          </v-btn>
          <v-btn
            icon
            @click.prevent="removeFile(file, $event)"
            v-if="!readonly && !$attrs.disabled && !previewOnly"
            :title="$t('forms.tooltip-remove-file')"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <v-list-item v-if="filesList.length === 0 && previewOnly">
        <span class="text-truncate text-no-wrap font-italic grey--text">
            {{ $t("pages.usersId.no-contract-available") }}
          </span>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import {computed, ref} from "@vue/composition-api";
import jsFileDownload from "js-file-download";
import SigningLogsPopup from "@/components/elements/SigningLogsPopup";

export default {
  components: {SigningLogsPopup},
  props: {
    value: "",
    label: "",
    initialDate: "",
    min: "",
    accept: "",
    fieldKey: "",
    files: Array,
    preview: Boolean,
    toDelete: {
      type: Array,
      default() {
        return [];
      }
    },
    readonly: Boolean,
    previewOnly: Boolean,
    editMode: Boolean,
    signinLogs: {
      type: Array,
      default: () => ([])
    },
    userId: String,
    contractImported: Boolean
  },
  setup(props, {root}) {
    /**
     * @type {{
     * $alerts: import("../../../@types/AlertsPlugin").AlertsPlugin
     * $apiCalls: import("../../../@types/ApiCallsPlugin").ApiCallsPlugin
     * }}
     */
    const {$apiCalls, $delete, $alerts} = root;

    const formattedValue = computed(() => props.value);
    /**
     * @type {[]}
     */
    const filesList = computed(() => {
      return props.files
        ? props.files.filter(_file => _file.fieldName === props.fieldKey)
        : [];
    });

    function getFilePreview(file) {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }

      return new Promise(async (resolve, reject) => {
        const result = await $apiCalls.downloadFile(file.id);

        resolve(
          URL.createObjectURL(
            new Blob([result.data], {
              type: `${file.type}/${file.subtype}`
            })
          )
        );
      });
    }

    async function previewFile(file) {
      try {
        window.open(await getFilePreview(file), "__blank");
      } catch (er) {
        $alerts.error(er);
      }
    }

    const openFile = async function (file) {
      try {
        const result = await $apiCalls.downloadFile(file._id);

        // if there is already a dialog opened, open the file in a new tab instead of the preview dialog
        if (root.$store.getters["dialog/dialogState"]) {
          return window.open(
            URL.createObjectURL(
              new Blob([result.data], {type: `${file.type}/${file.subtype}`})
            ),
            "__blank"
          );
        }

        root.$store.dispatch("dialog/updateStatus", {
          title: file.clientName,
          id: "FilePreviewer",
          fullscreen: false,
          data: {
            mimeType: `${file.type}/${file.subtype}`,
            fileData: result.data,
            fileUrl: URL.createObjectURL(
              new Blob([result.data], {type: `${file.type}/${file.subtype}`})
            )
          }
        });
      } catch (er) {
        $alerts.error(er);
      }
    };

    const downloadFile = async function (file, e) {
      e.preventDefault();
      e.stopPropagation();

      try {
        const result = await $apiCalls.downloadFile(file._id);

        jsFileDownload(
          result.data,
          file.clientName
          // file.type + "/" + file.subtype
        );
      } catch (er) {
        $alerts.error(er);
      }
    };

    const removeFile = async function (file, e) {
      e.preventDefault();
      e.stopPropagation();

      const index = filesList.value.findIndex(
        _entry => _entry._id === file._id
      );

      try {
        await $alerts.askBeforeAction({
          key: "remove-file",
          data: file,
          settings: {
            confirmButtonColor: "red"
          },
          preConfirm: async () => {
            try {
              await $apiCalls.deleteFile(file._id);

              $delete(props.files, index);
            } catch (er) {
              $alerts.error(er);
            }
          }
        });
      } catch (er) {
        $alerts.error(er);
      }
    };

    return {
      formattedValue,
      filesList,
      downloadFile,
      removeFile,
      openFile,
      previewFile,
      getFilePreview
    };
  },
  methods: {
    onChange(value) {
      this.$emit("change", value);
    },
    onInput(value) {
      this.$emit("input", value);
    }
  }
};
</script>
