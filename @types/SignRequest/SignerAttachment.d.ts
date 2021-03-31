import {RequiredAttachment} from "./RequiredAttachment";

export interface SignerAttachment {
  uuid?: string
  name?: string
  file?: string
  for_attachment?: RequiredAttachment
}
