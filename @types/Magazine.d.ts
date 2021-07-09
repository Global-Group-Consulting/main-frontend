export interface IMagazine {
  id: string
  title: string
  coverFileId: string
  coverFile?: any
  fileId: string

  publicationDate: string
  showFrom: string
  showUntil: string
}

export interface FormMagazineCreate{
  title: string,
  pdfFile: any,
  coverFile?: any,
  publicationDate: string,
  showRange: string[],
}
