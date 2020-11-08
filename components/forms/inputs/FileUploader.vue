<template>
  <div>
    <v-file-input
      v-bind="$attrs"
      :value="formattedValue"
      :label="label"
      @input="onInput"
      @change="onChange"
    >
      <template v-slot:label>
        <slot name="label"></slot>
      </template>
      <template v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
    </v-file-input>

    <v-list dense class="">
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
            :title="$t('forms.tooltip-remove-file')"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
  import { computed } from "@vue/composition-api";
  import jsFileDownload from "js-file-download";

  export default {
    props: {
      value: "",
      label: "",
      initialDate: "",
      min: "",
      fieldKey: "",
      files: Array,
      toDelete: {
        type: Array,
        default() {
          return [];
        },
      },
      readonly: Boolean,
      editMode: Boolean,
    },
    setup(props, { root }) {
      /**
       * @type {{
       * $alerts: import("../../../@types/AlertsPlugin").AlertsPlugin
       * $apiCalls: import("../../../@types/ApiCallsPlugin").ApiCallsPlugin
       * }}
       */
      const { $apiCalls, $delete, $alerts } = root;

      const formattedValue = computed(() => props.value);
      /**
       * @type {[]}
       */
      const filesList = computed(() => {
        return props.files
          ? props.files.filter((_file) => _file.fieldName === props.fieldKey)
          : [];
      });

      const openFile = async function (file) {
        const result = await $apiCalls.downloadFile(file._id);

        root.$store.dispatch("dialog/updateStatus", {
          title: file.clientName,
          id: "FilePreviewer",
          fullscreen: false,
          data: {
            mimeType: `${file.type}/${file.subtype}`,
            fileData: result.data,
            fileUrl: URL.createObjectURL(
              new Blob([result.data], { type: `${file.type}/${file.subtype}` })
            ),
          },
        });
      };

      const downloadFile = async function (file, e) {
        e.preventDefault();
        e.stopPropagation();

        const result = await $apiCalls.downloadFile(file._id);

        jsFileDownload(
          result.data,
          file.clientName
          // file.type + "/" + file.subtype
        );
      };

      const removeFile = async function (file, e) {
        e.preventDefault();
        e.stopPropagation();

        const index = filesList.value.findIndex(
          (_entry) => _entry._id === file._id
        );

        try {
          await $alerts.askBeforeAction({
            key: "remove-file",
            data: file,
            settings: {
              confirmButtonColor: "red",
            },
            preConfirm: async () => {
              try {
                await $apiCalls.deleteFile(file._id);

                $delete(props.files, index);
              } catch (er) {
                $alerts.error(er);
              }
            },
          });
        } catch (er) {}
      };

      return {
        formattedValue,
        filesList,
        downloadFile,
        removeFile,
        openFile,
      };
    },
    methods: {
      onChange(value) {
        this.$emit("change", value);
      },
      onInput(value) {
        this.$emit("input", value);
      },
    },
  };
</script>
