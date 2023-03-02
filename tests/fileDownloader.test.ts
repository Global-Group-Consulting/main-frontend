import { moneyFormatter } from '~/plugins/filters/moneyFormatter'

import { useFileDownloader } from '../composables/fileDownloader'

process.env.SERVER_URL = 'http://local.api.globalgroup.consulting/'

describe('Testing srcUrl', () => {
  const downloader = useFileDownloader({} as any)
  
  test('should return an error', () => {
    expect(() => downloader.srcUrl()).toThrow('Invalid url arguments')
  })
  
  test('should compile a valid url', () => {
    expect(downloader.srcUrl('1hg1231fhg')).toBe(process.env.SERVER_URL + 'api/files/1hg1231fhg/show')
  })
})

describe('Testing createApiUrl', () => {
  const downloader = useFileDownloader({} as any)
  
  test('should return an error', () => {
    expect(() => downloader.createApiUrl()).toThrow('Invalid url arguments')
    expect(() => downloader.createApiUrl("", undefined)).toThrow('Invalid url arguments')
    expect(() => downloader.createApiUrl(null)).toThrow('Invalid url arguments')
  })
  
  test('should compile a valid url', () => {
    expect(downloader.createApiUrl('api', "files")).toBe(process.env.SERVER_URL + 'api/files')
  })
  
  // expect(downloader.srcUrl('1hg1231fhg')).toBe(process.env.SERVER_URL + 'api/files/1hg1231fhg/show')
})
