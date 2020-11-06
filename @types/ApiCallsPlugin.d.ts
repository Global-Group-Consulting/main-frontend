import { ApiCalls } from "../plugins/apiCalls"

export interface ApiCallsPlugin extends ApiCalls {

}

export interface ApiCallsParams {
  method?: string
  endPoint: string
  setLoading?: boolean
  params?: {}
  body?: {}
  loadingDispatcher?: string
  returnRaw?: boolean
  downloadMode?: boolean
  uploadMode?: boolean
}

export interface ApiCallsSettings {
  method: string
  endPoint: string
  setLoading: boolean
  params: {}
  data: {}
  loadingDispatcher?: string
  returnRaw?: boolean
  downloadMode?: boolean
  uploadMode?: boolean
}
