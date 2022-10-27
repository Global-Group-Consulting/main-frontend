import Vue from 'vue'
import { User } from '~/@types/UserFormData'

export class UsersTableActions {
  private ctx: Vue
  
  constructor (ctx: Vue) {
    this.ctx = ctx
  }
  
  openEdit (userId: string) {
    const path = '/users/' + userId
    
    window.open(path, '_blank')
  };
  
  openProfile (userId: string) {
    const path = '/users/profile/' + userId
    
    window.open(path, '_blank')
  }
  
  async delete (user: User) {
    const { firstName, lastName, id } = user
    
    try {
      await this.ctx.$alerts.askBeforeAction({
        key: 'delete-user',
        data: { firstName, lastName },
        settings: {
          confirmButtonColor: 'red'
        },
        preConfirm: async () => {
          await this.ctx.$apiCalls.userDelete(user.id || user._id)
          // await this.ctx.$store.dispatch('users/userDeleted')
          this.ctx.$nuxt.$emit('user:deleted', id)
          
        }
      })
    } catch (er) {
      this.ctx.$alerts.error(er)
    }
  };
}
