<template>
  <div class="rich-text-editor">
    <slot name="label"></slot>

    <div class="v-text-field border-bottom" id="richTextEditor" style="padding-bottom: 20px"></div>

    <div class="v-messages theme--light error--text">
      <div class="v-messages__wrapper">
        <div class="v-messages__message" v-html="editorError || errorMessages"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, watch } from '@vue/composition-api';
  import EditorJS, { OutputBlockData, OutputData } from '@editorjs/editorjs';
  //@ts-ignore
  import Header from "@editorjs/header";
  //@ts-ignore
  import List from "@editorjs/list";
  //@ts-ignore
  import Delimiter from "@editorjs/delimiter";
  //@ts-ignore
  import Paragraph from "editorjs-paragraph-with-alignment";
  //@ts-ignore
  import Marker from "@editorjs/marker";
  //@ts-ignore
  import Underline from "@editorjs/underline";

  export default defineComponent({
    name: "RichTextEditor",
    props: {
      value: String,
      readonly: Boolean,
      disabled: Boolean,
      errorMessages: String
    },
    setup (props, { root, refs, emit }) {
      // const { $refs } = root;
      let editor: EditorJS;
      const editorError = ref("");
      const defaultData = {
        "time": new Date().getTime(),
        "blocks": [
          {
            "type": "paragraph",
            "data": {
              // "text": "Nessun messaggio..."
            }
          },
        ],
        "version": "2.8.1"
      }

      async function getText () {
        const content = await editor.save();
        const htmlText = content.blocks.reduce((acc, curr) => {
          // @ts-ignore
          acc.push(curr.data?.text.trim());

          return acc;
        }, [])

        const trimmedString = htmlText.join("").trim();

        if (trimmedString) {
          emit("input", JSON.stringify(content))
        } else {
          emit("input", "")
          await editor.render(defaultData)
        }
      }

      watch(() => props.readonly, () => {
        editor.readOnly.toggle(props.readonly || props.disabled)
      })

      watch(() => props.disabled, () => {
        editor.readOnly.toggle(props.readonly || props.disabled)
      })

      onMounted(() => {
        let data = defaultData;

        if (props.value) {
          try {
            data = JSON.parse(props.value)
          } catch (er) {

          }
        }

        // available plugins
        // https://github.com/editor-js/awesome-editorjs

        editor = new EditorJS({
          holderId: "richTextEditor",
          data,
          readOnly: props.readonly || props.disabled,
          placeholder: "Cosa vuoi dire?",
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Inserisci un titolo',
              }
            },
            paragraph: {
              class: Paragraph,
              config: {
                placeholder: "Inserisci del testo..."
              }
            },
            Marker,
            Underline,
            List,
            Delimiter,
          },
          onChange: (a, b) => {
            debugger
            getText()
          },
          onReady () {
          }
        });
      })

      return {
        editorError
      }
    }
  });
</script>

<style lang="scss">
  #richTextEditor {

    .codex-editor__redactor {
      padding-bottom: 0px !important;
    }
  }
</style>

<style scoped lang="scss">
  ::v-deep.rich-text-editor {
    font-size: 1rem;

    .v-input__slot {
      flex-direction: column;
    }
  }
</style>
