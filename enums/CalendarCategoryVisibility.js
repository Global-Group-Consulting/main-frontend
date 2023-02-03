import { BasicEnum } from '@/classes/BasicEnum'

class CalendarCategoryVisibility extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super('CalendarCategoryVisibility')
    
    this.ALL = 'all'
    this.ME = 'author'
    this.ADMINS = 'admin'
    this.CUSTOMER_SERVICES = 'clients_service'
    this.AGENTS = 'agent'
    
  }
}

export default new CalendarCategoryVisibility()
