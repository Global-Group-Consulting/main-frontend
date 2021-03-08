import {Context, Plugin} from "@nuxt/types";
import {AuthPlugin} from "~/@types/AuthPlugin";
import {User} from "~/@types/UserFormData";
import {Store} from 'vuex'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $acl: Acl
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $acl: Acl
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $acl: Acl
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $acl: Acl
  }
}

interface PermissionsParts {
  section: string
  type: string
  access: string
}


class Acl {
  private store: Store<any>

  constructor(context: Context) {
    this.store = context.store
  }

  get auth() {
    return this.store?.$auth || null
  }

  get userPermissions(): string[] {
    return this.auth?.user?.permissions || []
  }

  protected permissionParts(permission: string): PermissionsParts {
    const blocks: string[] = permission.split(/\.|:/)
    const toReturn: PermissionsParts = {section: "", type: "", access: ""}

    switch (blocks.length) {
      case 2:
        toReturn.section = blocks[0]
        toReturn.access = blocks[1]
        break;
      case 3:
        toReturn.section = blocks[0]
        toReturn.type = blocks[1]
        toReturn.access = blocks[2]
        break;
    }

    return toReturn
  }

  checkPermissions(requiredPermissions: string[]): boolean {
    let toReturn = false

    /*
    If no permission in required, return true
     */
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    /*
    If the user has no permissions, but at least one is required, return false
     */
    if (!this.userPermissions) {
      return toReturn
    }

    reqPermissionsCycle: for (const permission of requiredPermissions) {
      const parts = this.permissionParts(permission)

      if (!parts.section || !parts.access) {
        continue
      }

      for (const userPermission of this.userPermissions) {
        const userParts = this.permissionParts(userPermission)

        /*
        Because the "type" does not always exists, if the permission has it and the user's one is different
        and the user has no wildcard, skip this userPermission, because is not valid
         */

        if ((parts.type && userParts.type !== parts.type && userParts.type !== "*")
          || (parts.access && userParts.access !== parts.access && userParts.access !== "*")) {
          continue
        }

        /*
        La soluzione migliore sarebbe prevedere una wildcard sia peril type che per l'access.
         */


        /*
         If the section matches and the access matches of the user has access *, return true
         and stop all the cycles.
         */
        if (parts.section === userParts.section &&
          (userParts.type === parts.type || userParts.type === "*") &&
          (userParts.access === parts.access || userParts.access === "*")) {
          toReturn = true

          // Once i found a valid match, stop all the cycles
          break reqPermissionsCycle;
        }
      }
    }

    return toReturn
  }

}

const aclPlugin: Plugin = (context, inject) => {
  const acl = new Acl(context)

  inject('acl', acl)
}

export default aclPlugin
