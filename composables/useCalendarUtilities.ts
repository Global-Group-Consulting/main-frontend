import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'

export const useCalendarUtilities = function () {
  function getTitle (event: CalendarEvent) {
    const clientName = event.client ? event.client.firstName + ' ' + event.client.lastName : event.clientName
    const title = []
    
    if (clientName) {
      title.push(clientName)
    }
    
    if (event.name) {
      title.push(event.name)
    }
    
    return title.join(' - ')
  }
  
  function getIcon (event: CalendarEvent) {
    const defaultIcon = 'mdi-checkbox-blank-circle'
    const user = event.users.find(u => u._id === event.authorId) ?? event.users[0]
    
    if (user) {
      return user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
    }
    
    return defaultIcon
  }
  
  function getColor (event: CalendarEvent) {
    return event.category?.color || 'primary'
  }
  
  function getUsers (event: CalendarEvent) {
    if (event.users.length === 0) return 'Tutti'
    
    return event.users.map(u => u.firstName + ' ' + u.lastName).join(', ')
  }
  
  return {
    getTitle,
    getIcon,
    getColor,
    getUsers
  }
}
