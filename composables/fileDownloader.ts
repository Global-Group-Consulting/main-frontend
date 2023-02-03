import jsFileDownload from 'js-file-download'
import { Alerts } from '~/plugins/alerts'
import { AxiosResponse } from 'axios'

export const useFileDownloader = function ($alerts: Alerts) {
  const types = {
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  
  const download = async (fetchData: () => Promise<AxiosResponse>, fileName: string, type: string = types.XLSX) => {
    try {
      const content = await fetchData()
      debugger
      
      jsFileDownload(content.data, fileName, type)
    } catch (e) {
      $alerts.error(e)
    }
  }
  
  return { download }
}
