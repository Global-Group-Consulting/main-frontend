import { User } from '~/@types/UserFormData'
// @ts-ignore
import * as TimeMe from 'timeme.js'
import { ApiCalls } from '~/plugins/apiCalls'

export interface ISession {
  id: string
  createdAt: number
  user: Pick<User, 'id' | 'role' | 'roles'>
  timers: ITimer[]
}

interface ITimer {
  pageName: string
  timeOnPage: number
}

let timer: any = null
let session: Session
let apiCalls: ApiCalls

export const useAnalytics = function (user: User, router: any, api: ApiCalls) {
  apiCalls = api
  
  addRouterHook(router)
  
  session = new Session(user)
  
  onRouteEntering(router.currentRoute)
}

async function storeTimers () {
  session.storeTimers(TimeMe.getTimeOnAllPagesInSeconds())
  
  const data = session.read()
  
  if (data && apiCalls) {
    await apiCalls.analyticsApi.sendAndStore(data)
  }
}

function startInterval () {
  if (timer) {
    storeTimers().then(() => {})
    clearTimeout(timer)
  }
  
  // every 15 seconds, store the timers to avoid losing data on refresh or close
  timer = setTimeout(() => {
    startInterval()
  }, 15000)
}

function addRouterHook (router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    onRouteEntering(to)
    
    next()
  })
}

function onRouteEntering (route: any) {
  const timers: { pageName: string, timeOnPage: number }[] = TimeMe.getTimeOnAllPagesInSeconds()
  const pageName = route.path
  
  const pageTimer = timers.find(timer => timer.pageName === pageName)
  
  const oldTimer = session.timers.find(timer => timer.pageName === pageName)?.timeOnPage || 0
  const startTime = Date.now() - (oldTimer * 1000)
  
  TimeMe.stopTimer()
  
  if (!pageTimer) {
    TimeMe.initialize({
      currentPageName: pageName,
      initialStartTime: startTime
    })
  } else {
    TimeMe.stopTimer()
    TimeMe.setCurrentPageName(pageName)
    TimeMe.startTimer(pageName, startTime)
  }
  
  // When entering a route, immediately start the timer to store the time spent on the previous page
  startInterval()
}

class Session {
  id!: string
  createdAt!: number
  user!: Pick<User, 'id' | 'role' | 'roles'>
  timers: ITimer[] = []
  
  constructor (user: User) {
    // try to read an existing one
    const session = this.read()
    
    // if not, create a new one
    if (!session) {
      this.create(user)
    }
  }
  
  hydrate (session: ISession) {
    this.id = session.id
    this.createdAt = session.createdAt
    this.user = session.user
    this.timers = session.timers
  }
  
  createId () {
    return 'ggc_' + Date.now() + '_' + Math.floor(Math.random() * 10000)
  }
  
  create (user: User) {
    this.hydrate({
      id: this.createId(),
      createdAt: Date.now(),
      user: {
        id: user.id,
        role: user.role,
        roles: user.roles
      },
      timers: []
    })
    
    this.store()
  }
  
  store () {
    // console.log('storing, ', JSON.stringify(this))
    sessionStorage.setItem('ggc_session', JSON.stringify(this))
  }
  
  storeTimers (timers: ITimer[]) {
    timers.forEach(timer => {
      const storedEntryIndex = this.timers.findIndex(t => t.pageName === timer.pageName)
      
      if (storedEntryIndex >= 0) {
        this.timers[storedEntryIndex].timeOnPage = timer.timeOnPage
      } else {
        this.timers.push(timer)
      }
    })
    
    this.store()
  }
  
  read (): ISession | null {
    const session = sessionStorage.getItem('ggc_session')
    
    if (session) {
      const data = JSON.parse(session)
      
      this.hydrate(data)
      
      return data
    }
    
    return null
  }
}

