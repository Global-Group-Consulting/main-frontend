<template>
  <div>
    <portal to="dialog-content">
      <dynamic-fieldset :schema="formSchema"
                        v-model="formData"
                        immediate-update
                        ref="form"
                        fill-row></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-left">
      <v-btn color="blue darken-1" text @click="toggleEditMode"
             v-if="!isNew && permission.canUpdate.value"
             :disabled="editMode">
        Modifica
      </v-btn>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="onClose" :disabled="gLoading || loading">
        {{ dialogSettings.texts.cancelBtn }}
      </v-btn>
      <v-btn color="blue darken-1" text
             v-if="editMode"
             @click="onSubmit"
             :loading="gLoading || loading">
        Salva
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';
  import { FormSchema } from '~/@types/FormSchema';
  import { INews, NewsStatus } from '~/@types/News';
  import { NewsPermissions } from '~/functions/acl/enums/news.permissions';

  interface Refs {
    form: any
  }

  export default defineComponent({
    name: "NewsDialog",
    setup (props, { root, refs, emit }) {
      const { $store, $alerts, $apiCalls, $acl } = root;
      const $refs: Refs = refs as any;
      const loading = ref(false);

      const permission = {
        canDelete: computed(() => {
          return $acl.checkPermissions([NewsPermissions.NEWS_ALL_CREATE])
        }),
        canCreate: computed(() => {
          return $acl.checkPermissions([NewsPermissions.NEWS_ALL_CREATE])
        }),
        canUpdate: computed(() => {
          return $acl.checkPermissions([NewsPermissions.NEWS_ALL_CREATE])
        })
      }

      const dialogSettings = computed(() => {
        return $store.getters["dialog/dialogData"]
      })
      const editMode = computed(() => !$store.getters["dialog/isReadonly"]);
      const news = computed(() => dialogSettings.value.data.news)
      const formData = ref(news.value)
      const isNew = computed(() => !news.value)
      const formSchema = computed((): FormSchema[] => {
        return [
          {
            cols: {
              title: {
                label: "news.title",
                disabled: !editMode.value,
                validations: {
                  required: {},
                }
              },
            },
          },
          {
            cols: {
              text: {
                component: "rich-text-editor",
                label: "news.text",
                disabled: !editMode.value,
                validations: {
                  required: {},
                }
              },
            },
          },
          /*{
            maxCols: 2,
            cols: {
              startAt: {
                component: "date-picker",
                label: "news.startAt",
                type: "datetime",
                disabled: !editMode.value,
              },
              endAt: {
                component: "date-picker",
                label: "news.endAt",
                disabled: !editMode.value,
              },
            },
          },*/
          {
            maxCols: 2,
            cols: {
              createdAt: {
                label: "news.createdAt",
                disabled: true,
                if: !isNew.value && permission.canDelete.value,
                formatter: "dateHourFormatter"
              },

              updatedAt: {
                label: "news.updatedAt",
                disabled: true,
                if: !isNew.value && permission.canDelete.value,
                formatter: "dateHourFormatter"
              }
            }
          },
        ]
      })
      let readTimer: any;
      let submitTimer: any;

      function onClose () {
        try {
          $store.dispatch("dialog/updateStatus", false);
        } catch (er) {
          console.error(er)
        }
      }

      async function onSubmit () {
        if (!$refs.form || !(await $refs.form.validate())) {
          return;
        }

        loading.value = true

        if (submitTimer) {
          clearTimeout(submitTimer)
        }

        submitTimer = setTimeout(async () => {
          try {
            const newData = await $apiCalls.news[isNew.value ? 'create' : 'update'](formData.value, news.value?._id);

            emit("dataStored", newData, isNew.value)

            onClose()
          } catch (er) {
            $alerts.error(er);
          } finally {
            loading.value = false
          }
        }, 1000)
      }

      function toggleEditMode () {
        const newState = !$store.getters["dialog/isReadonly"];
        $store.dispatch("dialog/updateData", {
          readonly: newState,
          texts: {
            cancelBtn: newState ? "Chiudi" : "Annulla"
          }
        })
      }

      async function setAsRead () {
        const data = news.value

        if (!data || (data.readings && data.readings.length > 0)) {
          return
        }

        try {
          const readStatus: NewsStatus = await $apiCalls.news.setAsRead(data._id)

          emit("setAsRead", readStatus)
        } catch (er) {

        }
      }

      onMounted(() => {
        readTimer = setTimeout(() => {
          setAsRead()
        }, 2000)
      })

      onBeforeUnmount(() => {
        console.log("cancelling timeout")
        clearTimeout(readTimer)
      })

      return {
        dialogSettings,
        formData, formSchema,
        editMode, loading,
        isNew,
        toggleEditMode,
        onClose,
        onSubmit,
        permission
      }
    }
  });
</script>

<style scoped>

</style>
