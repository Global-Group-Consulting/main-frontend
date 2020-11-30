<template>
  <div>
    <div class="editor">
      <!-- <editor-menu-bar :editor="editor" v-slot="{ commands }">
        <div class="menubar">
          <button
            class="menubar__button"
            @click="commands.mention({ id: 1, label: 'Philipp Kühn' })"
          >
            <span>Insert Mention</span>
          </button>
        </div>
      </editor-menu-bar> -->
      <editor-content class="editor__content" :editor="editor" />
    </div>

    <div class="suggestion-list" v-show="showSuggestions" ref="suggestions">
      <template v-if="hasResults">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="suggestion-list__item"
          :class="{ 'is-selected': navigatedUserIndex === index }"
          @click="selectUser(user)"
        >
          {{ user.firstName }} {{ user.lastName }} ({{
            $t(`enums.UserRoles.${$enums.UserRoles.getIdName(user.role)}`)
          }})
        </div>
      </template>
      <div v-else class="suggestion-list__item is-empty">
        No users found
      </div>
    </div>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import tippy, { sticky } from "tippy.js";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  HardBreak,
  Heading,
  Mention,
  Code,
  Bold,
  Italic
} from "tiptap-extensions";
import { json } from "body-parser";

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },

  props: {
    value: "",
    mentionsList: {
      type: Array
    }
  },

  data() {
    return {
      mentions: {},

      editor: new Editor({
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Mention({
            // a list of all suggested items
            items: () => this.mentionsList,
            // is called when a suggestion starts
            onEnter: ({ items, query, range, command, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.renderPopup(virtualNode);
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command;
            },
            // is called when a suggestion has changed
            onChange: ({ items, query, range, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.navigatedUserIndex = 0;
              this.renderPopup(virtualNode);
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null;
              this.filteredUsers = [];
              this.suggestionRange = null;
              this.navigatedUserIndex = 0;
              this.destroyPopup();
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              if (event.key === "ArrowUp") {
                this.upHandler();
                return true;
              }

              if (event.key === "ArrowDown") {
                this.downHandler();
                return true;
              }

              if (event.key === "Enter") {
                this.enterHandler();
                return true;
              }

              return false;
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: async (items, query) => {
              if (!query) {
                return items;
              }

              /* await new Promise(resolve => {
                setTimeout(resolve, 500);
              }); */

              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ["firstName", "lastName"]
              });

              return fuse.search(query).map(item => item.item);
            }
          }),
          new Code(),
          new Bold(),
          new Italic()
        ],
        content: this.value,
        onUpdate: (value, a, b) => {
          let toEmit = "";

          if (value.state.doc.textContent) {
            toEmit = value.getHTML();
          }

          this.$emit("input", toEmit);
        }
      }),
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      insertMention: () => {}
    };
  },

  computed: {
    hasResults() {
      return this.filteredUsers.length;
    },

    showSuggestions() {
      return this.query || this.hasResults;
    }
  },

  methods: {
    // navigate to the previous item
    // if it's the first item, navigate to the last one
    upHandler() {
      this.navigatedUserIndex =
        (this.navigatedUserIndex + this.filteredUsers.length - 1) %
        this.filteredUsers.length;
    },

    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler() {
      this.navigatedUserIndex =
        (this.navigatedUserIndex + 1) % this.filteredUsers.length;
    },

    enterHandler() {
      const user = this.filteredUsers[this.navigatedUserIndex];

      if (user) {
        this.selectUser(user);
      }
    },

    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectUser(user) {
      this.insertMention({
        range: this.suggestionRange,
        attrs: {
          id: user.id,
          label: (user.firstName + user.lastName).replace(/ /g, "")
        }
      });
      this.editor.focus();
    },

    // renders a popup with suggestions
    // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
    renderPopup(node) {
      if (this.popup) {
        return;
      }

      // ref: https://atomiks.github.io/tippyjs/v6/all-props/
      this.popup = tippy(".editor", {
        getReferenceClientRect: node.getBoundingClientRect,
        appendTo: () => document.body,
        interactive: true,
        sticky: true, // make sure position of tippy is updated when content changes
        plugins: [sticky],
        content: this.$refs.suggestions,
        trigger: "mouseenter", // manual
        showOnCreate: true,
        theme: "dark",
        placement: "top-start",
        inertia: true,
        duration: [400, 200]
      });
    },

    destroyPopup() {
      if (this.popup && this.popup.length > 0) {
        this.popup[0].destroy();
        this.popup = null;
      }
    }
  },

  beforeDestroy() {
    try {
      this.destroyPopup();
    } catch (er) {}
  },

  watch: {
    value(val) {
      try {
        const textContent = this.editor.state.doc.textContent;

        if (!val && !textContent) {
          return;
        }

        if (!val) {
          this.editor.clearContent();
        }

        if (val && this.editor.getHTML() !== val) {
          this.editor.setContent(val);
        }
      } catch (er) {
        console.error(er);
      }
    }
  }
};
</script>

<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.editor {
  .ProseMirror {
    background: white;
    padding: 8px 10px;
    border: solid 1px $color-grey;
  }
}

.mention {
  background: rgba($color-black, 0.1);
  color: rgba($color-black, 0.6);
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}

.mention-suggestion {
  color: rgba($color-black, 0.6);
}

.suggestion-list {
  padding: 0.2rem;
  // border: 2px solid rgba($color-black, 0.1);
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  font-size: 0.8rem;
  font-weight: bold;
  background: white;
  color: black;
  font-family: "Roboto";

  &__no-results {
    padding: 0.2rem 0.5rem;
  }

  &__item {
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &.is-selected,
    &:hover {
      background-color: rgba(rgb(255, 208, 0), 0.2);
    }

    &.is-empty {
      opacity: 0.5;
    }
  }
}

.tippy-box[data-theme~="dark"] {
  background-color: $color-black;
  padding: 0;
  font-size: 1rem;
  text-align: inherit;
  color: $color-white;
  border-radius: 5px;
}
</style>
