<template>
  <div class="flex-grow-1">
    <div v-if="comments.length && !fetchError">
      <v-list color="transparent overflow-auto" max-height="300px"
              two-line dense tile
      >
        <UseElementVisibility v-for="comment in comments" :key="comment._id"
                              @visibility-changed="onCommentVisibilityChanged(comment, $event)"
                              :delay="1500"
        >
          <v-list-item :class="{'editing': editingComment && editingComment._id === comment._id,
                     'unread': !checkIsRead(comment),
                     'highlight' : toHighlight.includes(comment._id)
          }">
            <v-list-item-content>
              <v-list-item-title class="text-wrap">
                <template v-if="!editingComment || editingComment._id !== comment._id">
                  {{ comment.message }}
                </template>
                <v-textarea v-else
                            dense
                            placeholder="Scrivi un commento"
                            rows="1"
                            auto-grow
                            class="mt-5"
                            hide-details
                            v-model="editingComment.message"
                            :loading="loading"
                            :disabled="loading"
                >
                  <template v-slot:append-outer>
                    <v-btn icon
                           @click="onEditSaveClick"
                           color="success"
                           :loading="loading"
                           :disabled="!editingComment.message">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                    <v-btn icon
                           @click="onEditCancelClick"
                           color="error"
                           :disabled="loading">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-textarea>
              </v-list-item-title>
              <v-list-item-subtitle class="text-right caption">
                <span class="text--secondary">{{ comment.author.firstName }} {{ comment.author.lastName }}</span>
                <span class="text--secondary"> - </span>
                <span class="text--secondary">{{ comment.updated_at | dateHourFormatter }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action class="flex-row comment-actions"
                                v-if="checkCanEdit(comment)">
              <v-btn icon color="warning" @click="onEditClick(comment)">
                <v-icon>mdi-comment-edit</v-icon>
              </v-btn>

              <v-btn icon color="error" @click="onDeleteClick(comment)">
                <v-icon>mdi-comment-remove</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </UseElementVisibility>

      </v-list>

      <v-divider></v-divider>
    </div>

    <v-alert v-if="fetchError" type="error" class="mt-3" outlined border="left">
      Oops! Qualcosa è andato storto e non riusciamo a recuperare i commenti precedenti.
    </v-alert>

    <v-textarea v-if="canAdd"
                dense
                label="Scrivi un commento"
                rows="1"
                auto-grow
                class="mt-5"
                v-model="newMessage"
                :loading="loading"
                :disabled="loading"
    >
      <template v-slot:append-outer>
        <v-btn icon
               @click="onSubmitClick"
               color="primary"
               :loading="loading"
               :disabled="!newMessage">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>
    </v-textarea>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { CalendarEventComment } from '~/@types/Calendar/CalendarEventComment'

export default defineComponent({
  name: 'CalendarEventComments',
  props: {
    event: {
      type: Object as PropType<CalendarEvent>,
      default: () => ({}),
      required: true
    },
    mustReload: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { root, emit }) {
    const { $apiCalls, $alerts, $store } = root
    const comments: Ref<CalendarEventComment[]> = ref([])
    const fetchError = ref(null)
    const newMessage = ref('')
    const loading = ref(false)
    const editingComment: Ref<null | CalendarEventComment> = ref(null)
    const toHighlight: Ref<string[]> = ref([])

    const canAdd = computed(() => {
      return $store.getters['user/userIsAdmin']
          || $store.getters['user/current']._id === props.event.authorId
          || (props.event.userIds || []).find(_id => _id === $store.getters['user/current']._id)
    })

    const checkCanEdit = (comment: CalendarEventComment) => {
      return /*$store.getters['user/userIsAdmin'] || */ $store.getters['user/current']._id === comment.author._id
    }

    const checkIsRead = (comment: CalendarEventComment) => {
      // true if is read
      return !!comment.readings?.find(unread => unread.userId === $store.getters['user/current']._id)
    }

    async function fetchData () {
      fetchError.value = null

      try {
        comments.value = await $apiCalls.calendarEventCommentsApi.readForEvent(props.event._id)
      } catch (e: any) {
        fetchError.value = e.message
      }

      emit("data-loaded")
    }

    async function onSubmitClick () {
      try {
        loading.value = true

        const justAdded = await $apiCalls.calendarEventCommentsApi.create(props.event._id, newMessage.value)

        newMessage.value = ''

        await fetchData()

        highlightComment(justAdded)
      } catch (e: any) {
        $alerts.error(e)
      }

      loading.value = false
    }

    async function onDeleteClick (comment: CalendarEventComment) {
      try {
        $alerts.askBeforeAction({
          key: 'calendarEventComments.delete-comment',
          preConfirm: async () => {
            try {
              await $apiCalls.calendarEventCommentsApi.destroy(comment._id)

              await fetchData()
            } catch (e: any) {
              $alerts.error(e)
            }

            return true
          }
        })
      } catch (e: any) {
        // Do nothing
      }
    }

    async function onEditClick (comment: CalendarEventComment) {
      editingComment.value = {
        ...comment
      }
    }

    async function onEditSaveClick () {
      if (!editingComment.value) {
        return
      }

      try {
        loading.value = true

        await $apiCalls.calendarEventCommentsApi.update(editingComment.value.eventId, editingComment.value._id, editingComment.value.message)

        newMessage.value = ''

        await fetchData()

        highlightComment(editingComment.value)

        editingComment.value = null
      } catch (e: any) {
        $alerts.error(e)
      }

      loading.value = false
    }

    async function onEditCancelClick () {
      editingComment.value = null
    }

    async function onCommentVisibilityChanged (comment: CalendarEventComment, visible: boolean) {
      if (visible && !checkIsRead(comment)) {
        try {
          comment.readings = await $apiCalls.calendarEventCommentsApi.markAsRead(comment._id)

          const unreadComments = comments.value.filter(_comment => !checkIsRead(_comment))

          if (!unreadComments.length) {
            emit('comments-read', props.event._id)
          }
        } catch (e: any) {
          comment.readings.pop()
        }
      }
    }

    function highlightComment (comment: CalendarEventComment) {
      toHighlight.value.push(comment._id)

      setTimeout(() => {
        toHighlight.value.splice(toHighlight.value.indexOf(comment._id), 1)
      }, 2000)
    }

    /*watch(() => props.event, (event) => {
      fetchData()
    }, { immediate: true, deep: true })*/

    watch(() => props.mustReload, (mustReload) => {
      // each time the modal opens, this prop is set to true so I must refetch the data
      if (mustReload) {
        fetchData()
      }
    }, {immediate: true})

    return {
      comments,
      fetchError,
      newMessage,
      loading,
      editingComment,
      toHighlight,
      onSubmitClick,
      onDeleteClick,
      onEditClick,
      onEditSaveClick,
      onEditCancelClick,
      onCommentVisibilityChanged,
      checkCanEdit,
      checkIsRead,
      canAdd
    }
  }
})
</script>

<style scoped lang="scss">
::v-deep .v-list-item {
  overflow:    hidden;
  transition:  border .3s ease-out;
  border-left: transparent 0 dashed;

  &.unread {
    border-left: red 4px dashed;
  }

  &.highlight {
    border-left: #ffda1e 4px solid;
  }

  .comment-actions {
    position:         absolute;
    transform:        translateX(100%);
    right:            0;
    bottom:           0;
    top:              0;
    left:             0;
    opacity:          0;
    padding-right:    1rem;
    margin:           0 !important;
    align-items:      center;
    justify-content:  flex-end;
    background-image: linear-gradient(270deg, #ffffff, transparent);
    transition:       transform .25s ease-out, opacity .25s ease-out;
  }

  &:hover:not(.editing) {
    .comment-actions {
      transform: translateX(0);
      opacity:   1;
    }
  }
}
</style>
