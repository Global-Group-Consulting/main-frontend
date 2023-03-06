import jsFileDownload from 'js-file-download'
import { Alerts } from '~/plugins/alerts'
import { AxiosResponse } from 'axios'

export const useFileDownloader = function ($alerts: Alerts) {
  const types = {
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PDF: 'application/pdf'
  }
  
  const download = async (fetchData: () => Promise<AxiosResponse>, fileName: string, type: string = types.XLSX) => {
    try {
      const content = await fetchData()
      
      jsFileDownload(content.data, fileName, type)
    } catch (e) {
      $alerts.error(e)
    }
  }
  
  /**
   * Direct link to file from server
   * @param fileId
   */
  const srcUrl = (fileId: string) => {
    return createApiUrl(`/api/files/`, fileId, `show`)
  }
  
  /**
   * Link to the file from AWS
   * @param fileId
   */
  const getS3Url = (fileId: string) => {
    return createApiUrl(`/api/files/${fileId}/url`)
  }
  
  function createApiUrl (...args: string[]): string {
    if (!args || !args.length) {
      throw new Error('Invalid url arguments')
    }
    
    const toReturn = [process.env.SERVER_URL as string, ...args].map(str => {
      if (!str) {
        throw new Error('Invalid url arguments')
      }
      
      str = str.trim()
      
      if (str.endsWith('/')) {
        str = str.slice(0, -1)
      }
      
      if (str.startsWith('/')) {
        str = str.slice(1)
      }
      
      return str
    })
    
    return toReturn.join('/')
    
  }
  
  return {
    download,
    types,
    srcUrl,
    getS3Url,
    createApiUrl
  }
}
