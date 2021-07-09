import jsFileDownload from "js-file-download";
import {Plugin} from "@nuxt/types";
import {enums} from "~/plugins/enums";
import Vue from "vue";

class FileUtilities {
  static context: Vue;

  static async download(fileId: string, fileName?: string) {
    try {
      const result = await this.context.$apiCalls.downloadFile(fileId);

      jsFileDownload(result.data,
        fileName ?? ""
        // file.type + "/" + file.subtype
      );
    } catch (er) {
      this.context.$alerts.error(er);
    }
  }
}


declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $fileUtils: typeof FileUtilities
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $fileUtils: typeof FileUtilities
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $fileUtils: typeof FileUtilities
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $fileUtils: typeof FileUtilities
  }
}

const fileUtilsPlugin: Plugin = (context, inject) => {
  FileUtilities.context = context as any;

  inject('fileUtils', FileUtilities)
}

export default fileUtilsPlugin
