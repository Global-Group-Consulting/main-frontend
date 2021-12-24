import { Attachment } from '~/@types/Attachment';

export interface NewsStatus{
  "_id": string;
  "userId": string;
  "newsId": string;
  "createdAt": string;
  "updatedAt": string;
}

export interface INews {
  title: string;
  text: string;
  newsImg: Attachment;
  newsAttachments: Attachment[];
  active: boolean; // Allow to manually hide a news even if must be shown
  createdBy: string;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  _id: string,
  readings: NewsStatus[]
}

export interface NewsCreateDto {
  title: string;
  text: string;
  active?: boolean; // Allow to manually hide a news even if must be shown
  startAt?: Date;
  endAt?: Date;
  newsAttachments?: File[];
  newsImg?: File[]
}

export interface NewsUpdateDto extends NewsCreateDto {
}
